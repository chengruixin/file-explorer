package dbclient

import (
	"database/sql"
	"fmt"
	"goserver/api/types/files"
)

func buildFileInfoInsertionValue(fInfo *files.FileInfo) string {
	return fmt.Sprintf(
		`("%v", "%v", %v, %v, "%v", "%v")`,
		*fInfo.FormatPath(),
		*fInfo.FileName,
		*fInfo.CreationTime,
		*fInfo.Size,
		*fInfo.Extra,
		*fInfo.ExtName,
	)
}

func buildFileInfoFromSelect(results *sql.Rows) (*files.FileInfo, error) {
	var fileInfo files.FileInfo
	err := results.Scan(
		&fileInfo.ID,
		&fileInfo.FilePath,
		&fileInfo.FileName,
		&fileInfo.CreationTime,
		&fileInfo.Size,
		&fileInfo.Extra,
		&fileInfo.ExtName,
	)
	if err != nil {
		return nil, err
	}
	return &fileInfo, nil
}
