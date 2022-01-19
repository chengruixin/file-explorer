package fileExplore

import (
	"encoding/json"
	"fmt"
	"io/fs"
	"io/ioutil"
	"os"
)

// get file from this package
func getFile(fileName string) *os.File {
	wdir, err := os.Getwd()

	if err != nil {
		panic(err)
	}

	file, err := os.Open(wdir + "/src/fileExplore/" + fileName)

	if err != nil {
		panic(err)
	}

	return file
}

func Test() {
	var fileLocs []string

	jsonFile := getFile("fileLocs.json")

	defer jsonFile.Close()

	byteVal, _ := ioutil.ReadAll(jsonFile)

	json.Unmarshal(byteVal, &fileLocs)

	for _, fileLoc := range fileLocs {

		fileSystem := os.DirFS(fileLoc)

		fs.WalkDir(fileSystem, ".", func(path string, d fs.DirEntry, err error) error {
			if err != nil {
				panic(err)
			}

			if d.IsDir() {
				return nil
			}

			fmt.Println(fileLoc + "/" + path)
			return nil
		})
	}
}
