package dbclient

import (
	"database/sql"
	"fmt"
	"goserver/api/types/files"
	"log"
	"sort"
	"strings"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

var (
	DB         *sql.DB
	DB_NAME    = "rax_video"
	TABLE_NAME = "video_list"
	INSERT_SQL = "INSERT INTO " + TABLE_NAME + "(file_path, file_name, creation_time, size, extra, ext_name) VALUES "
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
		DB, err = sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/"+DB_NAME)
		if err != nil {
			log.Fatalln("DB connection failed!")
		}
		DB.SetConnMaxLifetime(2000)
		DB.SetConnMaxIdleTime(1000)
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
			conditions = append(conditions, "file_path LIKE \"%"+p+"%\"")
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

	sqlStr := fmt.Sprintf(("SELECT * FROM " + TABLE_NAME + " %v %v %v"), whereClause, orderSql, limitClause)

	results, err := DB.Query(sqlStr)
	if err != nil {
		log.Fatalf(err.Error())
	}
	defer results.Close()

	videoInfoCollection := make([]*files.FileInfo, 0)
	for results.Next() {
		fileInfo, _ := buildFileInfoFromSelect(results)
		videoInfoCollection = append(videoInfoCollection, fileInfo)
	}

	// get total
	countResults, _ := DB.Query("SELECT count(*) as total FROM " + TABLE_NAME)
	var total int
	if countResults.Next() {
		countResults.Scan(&total)
	}
	return videoInfoCollection, total
}

// func InsertTest() {
// 	fPath, fName, extname, createTime, size, extra := "adf", "afile name", "ext .and", int64(123233), int64(12312312), "ewxtad"

// 	str := buildFileInfoInsertionValue(&files.FileInfo{
// 		FilePath:     &fPath,
// 		FileName:     &fName,
// 		ExtName:      &extname,
// 		CreationTime: &createTime,
// 		Size:         &size,
// 		Extra:        &extra,
// 	})

// 	_, err := DB.Query(INSERT_SQL + str)

// 	if err != nil {
// 		fmt.Println("err in inserting", err.Error())
// 	} else {
// 		fmt.Println("success in inserting")

// 	}
// }
func buildInsertStmtList(fileInfos []*files.FileInfo) []string {
	res := make([]string, len(fileInfos))
	for i, fileInfo := range fileInfos {
		res[i] = buildFileInfoInsertionValue(fileInfo)
	}
	return res
}

const SLICED_LENGTH = 5000

func UpdateVideosHard(fileInfos []*files.FileInfo) {
	_, err := DB.Query("DELETE FROM " + TABLE_NAME)

	if err != nil {
		fmt.Println("error in deleting table", err.Error())
		return
	}
	insertStmtList := buildInsertStmtList(fileInfos)

	fmt.Println("total len", len(insertStmtList))

	iterations := len(insertStmtList) / SLICED_LENGTH

	if len(insertStmtList)%SLICED_LENGTH > 0 {
		iterations++
	}

	for i := 0; i < iterations; i++ {
		var sliceStmtList []string
		if i < iterations-1 {
			sliceStmtList = insertStmtList[i*SLICED_LENGTH : (i+1)*SLICED_LENGTH]
			fmt.Println("slice len", len(sliceStmtList), " from ", i*SLICED_LENGTH, " to ", (i+1)*SLICED_LENGTH)
		} else {
			sliceStmtList = insertStmtList[i*SLICED_LENGTH:]
			fmt.Println("slice len", len(sliceStmtList), " from ", i*SLICED_LENGTH, " to end")
		}

		fmt.Println("inserting ", i)
		insertStmtJoined := strings.Join(sliceStmtList, ", ")
		_, err := DB.Query(INSERT_SQL + insertStmtJoined)

		if err != nil {
			fmt.Println("inserting failure", i, "\nwith error\n", err.Error())
		} else {
			fmt.Println("inserting success", i)
		}
	}
}

func UpdateVideosSoft(fileInfos []*files.FileInfo) error {
	sort.Slice(fileInfos, func(i, j int) bool {
		return *fileInfos[i].CreationTime > *fileInfos[j].CreationTime
	})

	var dbMaxCTime int64
	dbRes, _ := DB.Query("SELECT max(creation_time) as max FROM " + TABLE_NAME)
	defer dbRes.Close()

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

	_, err := DB.Query(INSERT_SQL + strings.Join(valueStrs, ", "))
	return err
}

func SearchVideoByID(id int64) *files.FileInfo {
	sqlStr := fmt.Sprintf("SELECT * from "+TABLE_NAME+" WHERE id=%v", id)
	results, err := DB.Query(sqlStr)

	if err != nil {
		log.Printf("Error in db query of %v\nError msg:\n %v", sqlStr, err.Error())
		return nil
	}

	defer results.Close()

	if results.Next() {
		f, _ := buildFileInfoFromSelect(results)
		return f
	}
	return nil
}
