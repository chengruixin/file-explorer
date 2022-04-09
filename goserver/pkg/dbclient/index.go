package dbclient

import (
	"database/sql"
	"fmt"
	"goserver/api/types/files"
	"log"
	"sort"
	"strings"
	"sync"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

var (
	db           *sql.DB
	insertionSQL = "INSERT INTO video_list(id, file_path, file_name, creation_time, size, extra, ext_name) VALUES "
)

// +---------------+------------------+------+-----+---------+----------------+
// | Field         | Type             | Null | Key | Default | Extra          |
// +---------------+------------------+------+-----+---------+----------------+
// | id            | int(10) unsigned | NO   | PRI | NULL    | auto_increment |
// | file_path     | varchar(500)     | YES  | MUL | NULL    |                |
// | file_name     | varchar(200)     | YES  | MUL | NULL    |                |
// | creation_time | bigint(20)       | YES  | MUL | NULL    |                |
// | size          | bigint(20)       | YES  |     | NULL    |                |
// | extra         | text             | YES  |     | NULL    |                |
// | ext_name      | varchar(120)     | YES  |     | NULL    |                |
// +---------------+------------------+------+-----+---------+----------------+

func init() {
	{ // db connection
		var err error
		db, err = sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/rax_video")
		if err != nil {
			log.Fatalln("DB connection failed!")
		}
		db.SetConnMaxLifetime(2000)
		db.SetConnMaxIdleTime(1000)
		fmt.Println("DB connected...")
	}

}

func SearchVideos(patterns []string, pageNo int, pageSize int) ([]*files.FileInfo, int) {
	t := time.Now()
	defer func() {
		fmt.Println("search videos duration", time.Since(t))
	}()
	whereClause := func() string {
		conditions := []string{}
		for _, p := range patterns {
			conditions = append(conditions, "file_name LIKE \"%"+p+"%\"")
		}

		return " WHERE " + strings.Join(conditions, " AND ") + " "
	}()

	limitClause := func() string {
		if pageNo <= 0 {
			return ""
		}

		return fmt.Sprintf(" LIMIT %v, %v ", pageNo-1, pageSize)
	}()

	orderSql := " ORDER BY creation_time DESC "
	// fmt.Println(whereClause)

	sqlStr := fmt.Sprintf(("SELECT * FROM video_list %v %v %v"), whereClause, orderSql, limitClause)

	results, err := db.Query(sqlStr)
	if err != nil {
		log.Fatalf(err.Error())
	}
	defer results.Close()

	videoInfoCollection := make([]*files.FileInfo, 0)
	for results.Next() {
		var tessql files.FileInfo

		err := results.Scan(
			&tessql.ID,
			&tessql.FilePath,
			&tessql.FileName,
			&tessql.CreationTime,
			&tessql.Size,
			&tessql.Extra,
			&tessql.ExtName,
		)

		if err != nil {
			log.Fatalf(err.Error())
		}
		videoInfoCollection = append(videoInfoCollection, &tessql)
	}

	// get total
	countResults, _ := db.Query("SELECT count(*) as total FROM video_list")
	var total int
	if countResults.Next() {
		countResults.Scan(&total)
	}
	return videoInfoCollection, total
}

func UpdateVideosHard(fileInfos []*files.FileInfo) error {
	syncLoc := new(sync.WaitGroup)

	syncLoc.Add(1)
	go func() {
		db.Query("DELETE FROM video_list")
		syncLoc.Done()
	}()

	// construct VALUES
	valueStrs := []string{}
	for _, fileInfo := range fileInfos {
		str := buildFileInfoInsertionValue(fileInfo)
		valueStrs = append(valueStrs, str)
	}
	leftStrs := valueStrs[:len(valueStrs)/2]
	rightStrs := valueStrs[len(valueStrs)/2:]
	leftJoin := strings.Join(leftStrs, ", ")
	rightJoin := strings.Join(rightStrs, ", ")

	queryFunc := func(str string) {
		db.Query(insertionSQL + str)
		syncLoc.Done()
	}
	syncLoc.Add(2)
	go queryFunc(leftJoin)
	go queryFunc(rightJoin)

	syncLoc.Wait()
	return nil
}

func UpdateVideosSoft(fileInfos []*files.FileInfo) error {
	sort.Slice(fileInfos, func(i, j int) bool {
		return *fileInfos[i].CreationTime > *fileInfos[j].CreationTime
	})

	var dbMaxCTime int64
	dbRes, _ := db.Query("SELECT max(creation_time) as max FROM video_list")
	if dbRes.Next() {
		dbRes.Scan(&dbMaxCTime)
	}

	valueStrs := []string{}
	for _, fInfo := range fileInfos {
		if *fInfo.CreationTime <= dbMaxCTime {
			break
		}

		fmt.Println("Should insert", *fInfo.FileName)
		valueStrs = append(valueStrs, buildFileInfoInsertionValue(fInfo))
	}

	if len(valueStrs) <= 0 {
		return nil
	}

	_, err := db.Query(insertionSQL + strings.Join(valueStrs, ", "))
	return err
}
