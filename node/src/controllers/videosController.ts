import { Request, Response } from "express";
import raxFileService from "../grpc";

const getVideos = async (req: Request, res: Response) => {
    const { search } = req.query as { search: string };
    if (!search) {
        res.json([]);
        return;
    }

    const videos = await raxFileService.SearchVideosAsync({
        Patterns: search.split(' '),
        PageNo: 0,
        PageSize: 0
    })

    res.json(videos);
}

const getVideoByID =async (req: Request, res: Response) => {
    
}