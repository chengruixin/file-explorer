package main

import (
	"context"
	"fmt"
	pb "goserver/api/types/protos"
	"log"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func main() {
	total := time.Now()
	defer func() {
		fmt.Println(time.Since(total))
	}()
	conn, err := grpc.Dial("127.0.0.1:6969", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()

	// fmt.Println(time.Since(t))
	client := pb.NewRaxFileClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*20)
	defer cancel()

	// { // search all videos
	// 	rpcRes, err := client.SearchVideos(ctx, &pb.SearchVideosRequest{
	// 		Patterns: []string{"jul", "12"},
	// 		PageNo:   0,
	// 		PageSize: 0,
	// 	})
	// 	if err != nil {
	// 		log.Fatalf(err.Error())
	// 	}

	// 	fmt.Println(len(rpcRes.GetFileInfo()))
	// 	fmt.Println(rpcRes.GetTotal())
	// }

	// { // refresh update
	// 	res, err := client.RescanFilesAndUpdateDB(ctx, &pb.RescanFilesAndUpdateDBRequest{})

	// 	if err != nil {
	// 		log.Fatalf(err.Error())
	// 	}

	// 	fmt.Println(res.GetSuccess())
	// }

	{ // search one video by id
		res, err := client.SearchVideoByID(ctx, &pb.SearchVideoByIDRequest{
			ID: 220914,
		})

		if err != nil {
			log.Fatalf(err.Error())
		}

		fmt.Println(res.FileInfo.FileName)
	}
}
