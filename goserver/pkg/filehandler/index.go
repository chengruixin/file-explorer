package filehandler

import (
	"goserver/api/types/files"
	"io/ioutil"
	"path/filepath"
	"syscall"
)

func ExploreFiles(path string) []*files.FileInfo {
	fs, _ := ioutil.ReadDir(path)
	fileInfos := []*files.FileInfo{}
	for _, file := range fs {
		if file.IsDir() {
			fileInfos = append(fileInfos, ExploreFiles(filepath.Join(path, file.Name()))...)
		} else {
			if filepath.Ext(file.Name()) == ".torrent" {
				continue
			}
			filelocation := filepath.Join(path, file.Name())
			d := file.Sys().(*syscall.Win32FileAttributeData)

			// new finfo
			fInfo := files.FileInfo{
				FilePath:     new(string),
				FileName:     new(string),
				ExtName:      new(string),
				CreationTime: new(int64),
				Size:         new(int64),
				Extra:        new(string),
			}
			*fInfo.FilePath = filelocation
			*fInfo.FileName = file.Name()
			*fInfo.ExtName = filepath.Ext(file.Name())
			*fInfo.CreationTime = d.CreationTime.Nanoseconds() / 1000 / 1000
			*fInfo.Size = file.Size()

			fileInfos = append(fileInfos, &fInfo)
		}
	}

	return fileInfos
}
