package main

import (
	"fmt"
	"goserver/api/types/files"
	"goserver/configs/exploredirs"
	"goserver/pkg/dbclient"
	"goserver/pkg/filehandler"
)

func main() {
	fileInfos := []*files.FileInfo{}
	for _, dir := range exploredirs.Dirs {
		fileInfos = append(fileInfos, filehandler.ExploreFiles(dir)...)
	}

	fmt.Println("Found ", len(fileInfos), " files")

	err := dbclient.UpdateVideosHard(fileInfos)

	if err != nil {
		panic(err.Error())
	}

	// files := dbclient.SearchVideos([]string{""}, 1, 10)
	// fmt.Println(len(files))

	// for _, v := range files {
	// 	fmt.Println(v.String())
	// }

}
