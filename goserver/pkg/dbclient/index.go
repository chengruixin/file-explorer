package dbclient

import (
	"database/sql"
	"fmt"
	"goserver/api/types/files"
	"log"
	"strings"

	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

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

func SearchVideos(patterns []string, pageNo int, pageSize int) []*files.FileInfo {
	whereClause := func() string {
		conditions := []string{}
		for _, p := range patterns {
			conditions = append(conditions, "file_name LIKE \"%"+p+"%\"")
		}

		return strings.Join(conditions, " AND ")
	}()

	// fmt.Println(whereClause)

	sqlStr := fmt.Sprintf(("SELECT * FROM video_list WHERE %v ORDER BY creation_time DESC LIMIT %v, %v"), whereClause, (pageNo-1)*pageSize, pageSize)
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

	return videoInfoCollection
}

func UpdateVideosHard(fileInfos []*files.FileInfo) error {
	/*
		INSERT INTO video_list(id, file_path, file_name, creation_time, size, extra, ext_name)
			VALUES (...), (...)
	*/
	db.Query("DELETE FROM video_list")

	// construct VALUES
	valueStrs := []string{}
	for _, fileInfo := range fileInfos {
		str := fmt.Sprintf(
			`(%v, "%v", "%v", %v, %v, "%v", "%v")`,
			0,
			*fileInfo.FormatPath(),
			*fileInfo.FileName,
			*fileInfo.CreationTime,
			*fileInfo.Size,
			*fileInfo.Extra,
			*fileInfo.ExtName,
		)
		valueStrs = append(valueStrs, str)
	}

	// leftStrs := valueStrs[:len(valueStrs)/2]
	// rightStrs := valueStrs[len(valueStrs)/2:]
	// leftJoin := strings.Join(leftStrs, ", ")
	// rightJoin := strings.Join(rightStrs, ", ")
	// fmt.Println("leng", len(leftJoin), len(rightJoin))
	// ioutil.WriteFile("test.txt", []byte(leftJoin), 0644)
	// ioutil.WriteFile("test.txt", []byte(strings.Join(valueStrs, ",")), 0644)
	_, err := db.Query("INSERT INTO video_list(id, file_path, file_name, creation_time, size, extra, ext_name) VALUES " + strings.Join(valueStrs, ","))
	// _, err = db.Query("INSERT INTO video_list(id, file_path, file_name, creation_time, size, extra, ext_name) VALUES " + rightJoin)

	return err
}
