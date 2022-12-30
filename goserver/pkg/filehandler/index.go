package filehandler

import (
	"goserver/api/types/files"
	"io/fs"
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

func buildFileInfo(path string, file fs.FileInfo) files.FileInfo {
	filelocation := filepath.Join(path, file.Name())
	d := file.Sys().(*syscall.Win32FileAttributeData)

	// new finfo
	fInfo := &files.FileInfo{
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

	return *fInfo
}

func ExploreFilesConcurrent(path string) []*files.FileInfo {
	fileList, _ := ioutil.ReadDir(path)

	fileInputChan := make(chan fs.FileInfo, len(fileList))

	for _, file := range fileList {
		fileInputChan <- file
	}

	close(fileInputChan)
	fileOutputChan := make(chan *files.FileInfo)
	quitChan := make(chan int)
	go fileWorker(fileInputChan, fileOutputChan, quitChan, path)
	go fileWorker(fileInputChan, fileOutputChan, quitChan, path)
	go fileWorker(fileInputChan, fileOutputChan, quitChan, path)
	go fileWorker(fileInputChan, fileOutputChan, quitChan, path)
	go fileWorker(fileInputChan, fileOutputChan, quitChan, path)

	returnedList := []*files.FileInfo{}
	completedJobs := 0
L:
	for {
		select {
		case output := <-fileOutputChan:
			returnedList = append(returnedList, output)
		case <-quitChan:
			completedJobs += 1
			if completedJobs >= 5 {
				break L
			}
		}
	}

	return returnedList
}

func fileWorker(fileInputChan <-chan fs.FileInfo, fileOutputChan chan<- *files.FileInfo, quitChan chan<- int, currentPath string) {
	for file := range fileInputChan {
		if file.IsDir() {
			subFiles := ExploreFilesConcurrent(filepath.Join(currentPath, file.Name()))

			for _, f := range subFiles {
				fileOutputChan <- f
			}

			continue
		}

		if filepath.Ext(file.Name()) == ".torrent" {
			continue
		}
		ff := buildFileInfo(currentPath, file)
		fileOutputChan <- &ff
	}
	quitChan <- 0
}

func ExploreFilesMulti(path []string) []*files.FileInfo {
	fileInfos := []*files.FileInfo{}
	for _, dir := range path {
		fileInfos = append(fileInfos, ExploreFilesConcurrent(dir)...)
	}

	return fileInfos
}
