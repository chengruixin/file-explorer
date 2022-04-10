import express from 'express';
import fs from 'fs';
import path from 'path';
import https from 'https';
import raxFileClient from './grpc';

const app = express()
const HTTP_PORT = 8080
const HTTPS_PORT = 8443

app.get('/videos', async (req, res) => {
    const { search } = req.query as {search: string};
    if (!search) {
        res.json([])
        return
    }

    const videos = await raxFileClient.SearchVideosAsync({
        Patterns: search.split(" "),
        PageNo: 0,
        PageSize: 0
    });
    res.json(videos);
});

app.get('/videos/:id', async (req, res) => {
    // try {
    //     const { id } = req.params
    //     const searchKey = Number(id)
    //     const movie = videoIDCache.has(searchKey)
    //         ? videoIDCache.get(searchKey)
    //         : await (async () => {
    //               // if cache does not key, fetch it from db and save it to cache.
    //               const res = await findMovieWithID(searchKey)
    //               videoIDCache.set(searchKey, res)
    //               return res
    //           })()
    //     const { handledFile: videoPath } = movie
    //     // const videoPath = 'D:/downloads/JUY833/JUY833.mp4'
    //     const range = req.headers.range
    //     const videoSize = fs.statSync(videoPath).size
    //     console.log(req.headers.range)

    //     const parts = range.replace(/bytes=/, '').split('-')
    //     const start = parseInt(parts[0], 10)
    //     const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1

    //     if (start >= videoSize) {
    //         res.status(416).send(
    //             'Requested range not satisfiable\n' + start + ' >= ' + videoSize
    //         )
    //         return
    //     }

    //     const contentLength = end - start + 1
    //     const file = fs.createReadStream(videoPath, { start, end })
    //     const headers = {
    //         'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    //         'Accept-Ranges': 'bytes',
    //         'Content-Length': contentLength,
    //         'Content-Type': 'video/mp4',
    //     }

    //     res.writeHead(206, headers)
    //     file.pipe(res);
    // } catch (e) {
    //     console.error('Catched Error:\n', e)
    // }
})

app.post('/videos/refresh', async (req, res) => {
    //
});

app.get('/videos/favorites', async (req, res) => {

});

app.post('/videos/favorites', async (req, res) => {

});
app.listen(HTTP_PORT, () => {
    console.log(`HTTP open on port ${HTTP_PORT}`)
})

const options = {
    key: fs.readFileSync(path.join(__dirname, '../.certs/server.key')),
    cert: fs.readFileSync(path.join(__dirname, '../.certs/server.cert')),
}

https.createServer(options, app).listen(HTTPS_PORT, () => {
    console.log(`HTTPS on port ${HTTPS_PORT}`)
})
