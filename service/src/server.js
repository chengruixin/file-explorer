const express = require("express");
const app = express();
const fs = require("fs");
const port = 8080;
const searchFiles = require("./common/searchFilesAsync");
const directoriesToBeExplored = require("./data/dirsTobeExplored");

// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild");
//     res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     next();
// })

app.get('/query', (req, res) => {
    const { search } = req.query;
    
    if(!search){
        res.json([]);
        console.log("return")
        return;
    }
    
    console.time("Processing Time")
    searchFiles(directoriesToBeExplored, search.split(" "))
        .then( data => {
            console.log(data.length);
            console.timeEnd("Processing Time")
            res.json(data);
        })
})


app.get('/videos', (req, res) => {
    console.log("requested")
    const { location : videoPath } = req.query;
    const range = req.headers.range;
    const videoSize = fs.statSync(videoPath).size;

    const chunkSize = 1 * 1e+6;
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + chunkSize, videoSize - 1);

    const contentLength = end - start + 1;

    const headers = {
        "Content-Range" : `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges" : "bytes",
        "Content-Length" : contentLength,
        "Content-Type" : "video/mp4"
    }

    res.writeHead(206, headers);

    const stream = fs.createReadStream(videoPath, {start, end});
    stream.pipe(res);
    // const videoStream = fs.createReadStream(location);
    // res.setHeader("Content-Type", "video/mp4");
    // videoStream.on("data", data => {
    //     // console.log(data);
    //     // console.log(typeof data);
    //     res.write(data);
    // });

    // videoStream.on("end", () => {
    //     console.log("end");
    //     res.end();
    // })

})
app.listen(port, () => {
    console.log("Listening on port " + port);
})