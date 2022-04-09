package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"time"

	pb "goserver/api/types/protos"
	"goserver/configs/exploredirs"
	"goserver/pkg/dbclient"
	"goserver/pkg/filehandler"

	"google.golang.org/grpc"
)

type raxFileServer struct {
	pb.UnimplementedRaxFileServer
}

func (r *raxFileServer) SearchVideos(ctx context.Context, in *pb.SearchVideosRequest) (*pb.SearchVideosResponse, error) {
	fileInfos, total := dbclient.SearchVideos(in.Patterns, int(in.PageNo), int(in.PageSize))

	pbFileInfos := []*pb.FileInfo{}
	for _, finfo := range fileInfos {
		pbFileInfos = append(pbFileInfos, &pb.FileInfo{
			ID:           *finfo.ID,
			FilePath:     *finfo.FilePath,
			ExtName:      *finfo.ExtName,
			CreationTime: *finfo.CreationTime,
			Size:         *finfo.CreationTime,
			Extra:        *finfo.Extra,
		})
	}
	res := pb.SearchVideosResponse{
		FileInfo: pbFileInfos,
		Total:    int32(total),
	}

	return &res, nil
}

func (r *raxFileServer) RescanFilesAndUpdateDB(ctx context.Context, in *pb.RescanFilesAndUpdateDBRequest) (*pb.RescanFilesAndUpdateDBResponse, error) {
	// search all files
	scanT := time.Now()
	fileInfos := filehandler.ExploreFilesMulti(exploredirs.Dirs)
	fmt.Println("scan", time.Since(scanT))

	{
		insertT := time.Now()
		defer func() {
			fmt.Println("insert", time.Since(insertT))
		}()
	}

	if err := dbclient.UpdateVideosSoft(fileInfos); err == nil {
		return &pb.RescanFilesAndUpdateDBResponse{
			Succes: true,
		}, nil
	} else {
		return &pb.RescanFilesAndUpdateDBResponse{
			Succes: false,
		}, err
	}
}

func main() {
	lis, err := net.Listen("tcp", "127.0.0.1:6969")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterRaxFileServer(s, &raxFileServer{})
	log.Printf("server listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
