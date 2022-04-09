package dbclient

import (
	"fmt"
	"goserver/api/types/files"
)

func buildFileInfoInsertionValue(fInfo *files.FileInfo) string {
	return fmt.Sprintf(
		`(%v, "%v", "%v", %v, %v, "%v", "%v")`,
		0,
		*fInfo.FormatPath(),
		*fInfo.FileName,
		*fInfo.CreationTime,
		*fInfo.Size,
		*fInfo.Extra,
		*fInfo.ExtName,
	)
}
