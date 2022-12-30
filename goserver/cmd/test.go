package main

import (
	"fmt"
	"goserver/configs/exploredirs"
	"goserver/pkg/filehandler"
)

func main() {
	fileInfos := filehandler.ExploreFilesMulti(exploredirs.Dirs)

	// fmt.Println("Found ", len(fileInfos), " files")

	// err := dbclient.UpdateVideosHard(fileInfos)

	// if err != nil {
	// 	panic(err.Error())
	// }

	// err := dbclient.UpdateVideosSoft(fileInfos)
	fmt.Println(len(fileInfos))

	// for _, v := range files {
	// 	fmt.Println(v.String())
	// }

}
