const express = require('express')
const fs = require('fs')
const HTTP_PORT = 8080
const HTTPS_PORT = 8443
const searchFiles = require('./common/searchFilesAsync')
const directoriesToBeExplored = require('./data/dirsTobeExplored')
const spdy = require('spdy')
const path = require('path')
const app = express()

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*')
//     // res.setHeader(
//     //     'Access-Control-Allow-Headers',
//     //     'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, Range, range'
//     // )
//     res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
//     next()
// })

app.get('/query', (req, res) => {
    const { search } = req.query
    console.log('\nSearching:', search)
    if (!search) {
        res.json([])
        console.log('return')
        return
    }

    console.time('Processing Time')
    searchFiles(directoriesToBeExplored, search.split(' ')).then((data) => {
        console.log(data.length)
        console.timeEnd('Processing Time')
        res.json(data)
    })
})

app.get('/videos', (req, res) => {
    const { location: videoPath } = req.query
    // const videoPath = 'D:/downloads/JUY833/JUY833.mp4'
    const range = req.headers.range
    const videoSize = fs.statSync(videoPath).size
    console.log(req.headers.range)

    const parts = range.replace(/bytes=/, '').split('-')
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1

    if (start >= videoSize) {
        res.status(416).send(
            'Requested range not satisfiable\n' + start + ' >= ' + videoSize
        )
        return
    }

    const contentLength = end - start + 1
    const file = fs.createReadStream(videoPath, { start, end })
    const headers = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'video/mp4',
    }

    res.writeHead(206, headers)
    file.pipe(res)
})

app.get('/image', (req, res) => {
    const stream = fs.createReadStream('./src/assets/out.png')

    stream.on('open', () => {
        console.log('Start sending image')
        res.setHeader('Content-Type', 'image/png')
        stream.pipe(res)
    })

    stream.on('error', (err) => {
        console.log(err)
        res.setHeader('Content-Type', 'text/plain')
        res.status(404).end('Not found')
    })
})

app.listen(HTTP_PORT, () => {
    console.log(`Http  open on port ${HTTP_PORT}`)
})

const options = {
    key: fs.readFileSync(path.join(__dirname, '../.certs/server.key')),
    cert: fs.readFileSync(path.join(__dirname, '../.certs/server.cert')),
}

spdy.createServer(options, app).listen(HTTPS_PORT, () => {
    console.log(`Https  open on port ${HTTPS_PORT}`)
})
