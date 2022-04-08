package files

import (
	"fmt"
	"path/filepath"
	"strings"
)

type FileInfo struct {
	ID           *int64
	FilePath     *string
	FileName     *string
	ExtName      *string
	CreationTime *int64
	Size         *int64
	Extra        *string
}

func (f *FileInfo) String() string {
	return fmt.Sprintf("Path: %v", *f.FilePath)
}

func (f *FileInfo) FormatPath() *string {
	subpathes := strings.Split(*f.FilePath, string(filepath.Separator))
	res := strings.Join(subpathes, "/")
	return &res
}
