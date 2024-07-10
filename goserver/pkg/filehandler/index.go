package filehandler

import (
	"goserver/api/types/files"
	"io/fs"
	"io/ioutil"
	"path/filepath"
	"sync"
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

	go func() {
		for _, file := range fileList {
			fileInputChan <- file
		}

		close(fileInputChan)
	}()

	fileOutputChan := make(chan *files.FileInfo)
	quitChan := make(chan int)

	const THREADS = 10

	for i := 0; i < THREADS; i++ {
		go fileWorker(fileInputChan, fileOutputChan, quitChan, path)
	}

	returnedList := []*files.FileInfo{}
	completedJobs := 0
L:
	for {
		select {
		case output := <-fileOutputChan:
			returnedList = append(returnedList, output)
		case <-quitChan:
			completedJobs++
			if completedJobs >= THREADS {
				break L
			}
		}
	}

	return returnedList
}

func fileWorker(fileInputChan <-chan fs.FileInfo, fileOutputChan chan<- *files.FileInfo, quitChan chan<- int, currentPath string) {
	var wg sync.WaitGroup

	for file := range fileInputChan {
		if file.IsDir() {
			wg.Add(1)
			go func(file fs.FileInfo, currentPath string) {
				defer wg.Done()
				subFiles := ExploreFilesConcurrent(filepath.Join(currentPath, file.Name()))
				for _, f := range subFiles {
					fileOutputChan <- f
				}
			}(file, currentPath)

			continue
		}

		if filepath.Ext(file.Name()) == ".torrent" {
			continue
		}
		ff := buildFileInfo(currentPath, file)
		fileOutputChan <- &ff
	}

	wg.Wait()
	quitChan <- 0
}

func ExploreFilesMulti(path []string) []*files.FileInfo {
	filesReceiverChan := make(chan *files.FileInfo)
	quitChan := make(chan int)
	for _, dir := range path {

		go func(dir string) {
			ffs := ExploreFilesConcurrent(dir)

			for _, ff := range ffs {
				filesReceiverChan <- ff
			}

			quitChan <- 0
		}(dir)
	}

	returnedList := []*files.FileInfo{}
	completedJobs := 0
L:
	for {
		select {
		case fileFromChan := <-filesReceiverChan:
			returnedList = append(returnedList, fileFromChan)
		case <-quitChan:
			completedJobs++
			if completedJobs >= len(path) {
				break L
			}
		}
	}

	return returnedList
}

func ExploreFilesMultiOld(path []string) []*files.FileInfo {
	fileInfos := []*files.FileInfo{}
	for _, dir := range path {
		fileInfos = append(fileInfos, ExploreFiles(dir)...)
	}

	return fileInfos
}

type PromiseStatus int

type ResolveCall func(value interface{})
type RejectCall func(reason interface{})

type InitialExecutor func(resolve ResolveCall, reject RejectCall)

const (
	FULFILLED PromiseStatus = 1
	REJECTED
	UNRESOLVED
)

type Promise struct {
	status PromiseStatus
	value  interface{}
	reason interface{}
}

func (p *Promise) resolveFunc(value interface{}) {
	if p.status != UNRESOLVED {
		return
	}
	p.value = value
	p.status = FULFILLED
}

func (p *Promise) rejectFunc(reason interface{}) {
	if p.status != UNRESOLVED {
		return
	}
	p.reason = reason
	p.status = REJECTED
}

func (p *Promise) Then() {

}

func NewPromise(executor InitialExecutor) Promise {
	p := Promise{
		status: UNRESOLVED,
		value:  nil,
		reason: nil,
	}
	executor(p.resolveFunc, p.rejectFunc)

	return p
}

// func main() {
// 	callPromise(func(resolve ResolveCall, reject RejectCall) {

// 	})
// }
