package main

import (
	"fmt"
	"goserver/configs/exploredirs"
	"goserver/pkg/dbclient"
	"goserver/pkg/filehandler"
	"time"
)

func main() {
	n := time.Now()
	fileInfos := filehandler.ExploreFilesMulti(exploredirs.Dirs)

	// fmt.Println("Found ", len(fileInfos), " files")

	// err := dbclient.UpdateVideosHard(fileInfos)

	// if err != nil {
	// 	panic(err.Error())
	// }

	// err := dbclient.UpdateVideosSoft(fileInfos)
	fmt.Println(len(fileInfos), time.Since(n).Milliseconds())

	err := dbclient.UpdateVideosHard(fileInfos)
	if err != nil {
		fmt.Println(err.Error())
	}
	// for _, v := range files {
	// 	fmt.Println(v.String())
	// }

}
