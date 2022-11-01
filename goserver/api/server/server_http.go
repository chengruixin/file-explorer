package main

import (
	"fmt"
	"goserver/pkg/dbclient"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

func sizeInGB(num int) string {
	return strconv.Itoa(num/1024/1024/1024) + " GB"
}

func handleErrorGeneral(ctx *gin.Context, err error) {
	ctx.JSON(http.StatusBadRequest, gin.H{
		"message": fmt.Sprintf("error: %s", err),
		"code":    1,
	})
}

func getVideos(ctx *gin.Context) {
	searchQuery := ctx.Query("search")

	patterns := []string{}

	if len(searchQuery) > 0 {
		patterns = strings.Split(searchQuery, " ")
	}

	fileInfos, _ := dbclient.SearchVideos(patterns, 0, 0)

	videoInfos := make([]gin.H, len(fileInfos))
	for i, fInfo := range fileInfos {
		videoInfos[i] = gin.H{
			"_id":         strconv.Itoa(int(*fInfo.ID)),
			"fileName":    *fInfo.FileName,
			"handledFile": *fInfo.FilePath,
			"extname":     *fInfo.ExtName,
			"fileSize":    sizeInGB(int(*fInfo.Size)),
		}
	}

	ctx.JSON(http.StatusOK, gin.H{
		"videoInfos": videoInfos,
	})
}

func main() {
	router := gin.Default()
	videosRouter := router.Group("/api/videos")
	{
		videosRouter.GET("/", getVideos)
		videosRouter.GET("/:id")
		videosRouter.POST("/refresh")
	}
	router.Run(":8080") // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
