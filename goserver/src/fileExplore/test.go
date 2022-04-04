package fileExplore

import (
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
)

// get file from this package
// func getFile(fileName string) *os.File {
// 	wdir, err := os.Getwd()

// 	if err != nil {
// 		panic(err)
// 	}

// 	file, err := os.Open(wdir + "/src/fileExplore/" + fileName)

// 	if err != nil {
// 		panic(err)
// 	}

// 	return file
// }

// mydir, err := os.Getwd()

// file_path, file_name, mod_time int 64, size int64, extra

// CREATE TABLE video_list (
// 	id INT UNSIGNED AUTO_INCREMENT,
//     file_path VARCHAR(500),
//     file_name VARCHAR(200),
//     modification_time BIGINT,
//     size BIGINT,
//     extra BLOB,
//     PRIMARY KEY (id)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

type FileInformation struct {
	ID               int64
	FilePath         string
	FileName         string
	ModificationTime int64
	Size             int64
	Extra            string
}

func buildFileInformation(fileLocation string, fileInfo fs.FileInfo) FileInformation {
	return FileInformation{
		0,
		fileLocation,
		fileInfo.Name(),
		fileInfo.ModTime().Unix(),
		fileInfo.Size(),
		"",
	}
}

func readStatByPath(path string) []FileInformation {
	ans := make([]FileInformation, 0)

	callback := func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			panic(err)
		}
		if d.IsDir() {
			return nil
		}
		// use path as the loction of this file
		f, e := os.Open(path)

		if e != nil {
			panic(err)
		}

		defer f.Close()

		fileStatInfo, e := f.Stat()

		if e != nil {
			panic(err)
		}

		fileInformation := buildFileInformation(path, fileStatInfo)
		ans = append(ans, fileInformation)
		return nil
	}

	filepath.WalkDir(path, callback)

	return ans
}
func Test() {
	// C:\MyCode\file-explorer\goserver\src\fileExplore\files
	var directories = []string{
		`F:/newworld`,
		// `F:/AllOfAll`,
		`F:/marvals`,
		`F:/themovies`,
	}

	var fileInfos = make([]FileInformation, 0)

	for _, dir := range directories {
		fmt.Println(dir)
		fileInfos = append(fileInfos, readStatByPath(dir)...)
	}
	fmt.Println(len(fileInfos))
	// err := SaveVideos(fileInfos)

	// if err != nil {
	// 	panic(err.Error())
	// }
}
