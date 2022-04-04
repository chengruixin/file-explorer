package fileExplore

import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

type FileInformationSQL struct {
	ID               sql.NullInt64
	FilePath         sql.NullString
	FileName         sql.NullString
	ModificationTime sql.NullInt64
	Size             sql.NullInt64
	Extra            sql.NullString
}

func Connect2DB() *sql.DB {
	db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/rax_video")

	if err != nil {
		panic(err.Error())
	}

	return db
}

func GetVideos() []FileInformation {
	db := Connect2DB()
	defer db.Close()

	results, err := db.Query("SELECT * FROM video_list")
	if err != nil {
		panic(err.Error())
	}
	defer results.Close()

	ans := make([]FileInformation, 0)
	for results.Next() {
		var fileInfo FileInformationSQL
		// for each row, scan the result into our tag composite object
		err = results.Scan(&fileInfo.ID, &fileInfo.FilePath, &fileInfo.FileName, &fileInfo.ModificationTime, &fileInfo.Size, &fileInfo.Extra)
		if err != nil {
			panic(err.Error()) // proper error handling instead of panic in your app
		}
		ans = append(ans, FileInformation{
			ID:               fileInfo.ID.Int64,
			FilePath:         fileInfo.FilePath.String,
			FileName:         fileInfo.FileName.String,
			ModificationTime: fileInfo.ModificationTime.Int64,
			Size:             fileInfo.Size.Int64,
			Extra:            fileInfo.Extra.String,
		})
	}

	return ans
}

func SaveVideos(fileInfos []FileInformation) error {
	db := Connect2DB()
	defer db.Close()

	for _, info := range fileInfos {
		sql := fmt.Sprintf(`
			INSERT INTO video_list
				SELECT 0, "%v", "%v", %v, %v, "" FROM video_list
					WHERE file_path = "%v" AND file_name = "%v"
					HAVING COUNT(*) = 0
		`, info.FilePath, info.FileName, info.ModificationTime, info.Size, info.FilePath, info.FileName)

		// fmt.Println(sql)
		insert, err := db.Query(sql)

		if err != nil {
			panic(err.Error())
		}

		insert.Close()
	}

	return nil
}
