import { Request, Response } from "express";
import raxFileService from "../grpc";
import fs from 'fs';
import { catchError } from "../utils/decorators";
import { sizeInGB } from '../utils/converter';
import { getFileInfoByID } from "../service";

class VideosController {
    @catchError async getVideos(req: Request, res: Response) {
        const { search } = req.query as { search: string };

        if (!search) {
            res.json([]);
            return;
        }

        const { FileInfos } = await raxFileService.SearchVideosAsync({
            Patterns: search.split(' '),
            PageNo: 0,
            PageSize: 0
        })

        const resData = FileInfos.map(info => ({
            _id: info.ID,
            fileName: info.FileName,
            handledFile: info.FilePath,
            extname: info.ExtName,
            fileSize: sizeInGB(info.Size)
        }));

        res.json({
            videoInfos: resData
        });
    }

    @catchError async getVideoByID(req: Request, res: Response) {
        const { id } = req.params;

        const fileInfo = await getFileInfoByID(id);

        // path: FileInfo.FilePath
        const { range } = req.headers;
        const videoSize = fs.statSync(fileInfo.FilePath).size;
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;

        if (start >= videoSize) {
            res.status(416).send(
                'Requested range not satisfiable\n' + start + ' >= ' + videoSize
            );
            return;
        }

        const contentLength = end - start + 1;
        const file = fs.createReadStream(fileInfo.FilePath, { start, end });
        const headers = {
            'Content-Range': `bytes ${start}-${end}/${videoSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': contentLength,
            'Content-Type': 'video/mp4',
        }

        res.writeHead(206, headers);
        file.pipe(res);
    }

    @catchError async updateVideosSoft(_: Request, res: Response) {
        const { success } = await raxFileService.RescanFilesAndUpdateDBAsync({})

        res.json({
            success
        });
    }
}

export default new VideosController();