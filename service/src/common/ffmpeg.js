// var spawn = require('child_process').spawn

// var cmd = '/home/ubuntu/bin/ffmpeg'

// var args = [
//     '-y',
//     '-i',
//     '/home/ubuntu/input.flv',
//     '-s',
//     '640x480',
//     '-codec:a',
//     'aac',
//     '-b:a',
//     '44.1k',
//     '-r',
//     '15',
//     '-b:v',
//     '1000k',
//     '-c:v',
//     'h264',
//     '-f',
//     'mp4',
//     '/home/ubuntu/output.mp4',
// ]

// var proc = spawn(cmd, args)

// proc.stdout.on('data', function (data) {
//     console.log(data)
// })

// proc.stderr.setEncoding('utf8')
// proc.stderr.on('data', function (data) {
//     console.log(data)
// })

// proc.on('close', function () {
//     console.log('finished')
// })

/**
 * @Copy from https://stackoverflow.com/questions/42012342/running-ffmpeg-via-nodejs-error
 * Anwsered and edited by Bulent Vural and Eliezser Steinbock
 */

const spawn = require('child_process').spawn


function getDuration(videoPath) {
    return new Promise((resolve, reject) => {
        const cmd = 'ffprobe'
        const args = [
            '-v',
            'error',
            '-show_entries',
            'format=duration',
            '-of',
            'default=noprint_wrappers=1:nokey=1',
            videoPath,
        ]
        const process = spawn(cmd, args)

        process.stdout.on('data', function (data) {
            // console.log(data)
            // console.log(parseInt(data.toString()))

            resolve(parseInt(data.toString()))

            // console.log(secondsToHMS(seconds))
        })

        process.stderr.setEncoding('utf8')
        process.stderr.on('data', function (data) {
            console.log(data)
            reject(data)
        })

        process.on('close', function () {
            console.log('finished')
        })
    })
}

function secondsToHMS(seconds) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const rest = (seconds % 3600) % 60

    let ans = ''

    if (hours < 10) {
        ans += '0' + hours.toString() + ':'
    } else {
        ans += hours.toString() + ':'
    }

    if (minutes < 10) {
        ans += '0' + minutes.toString() + ':'
    } else {
        ans += minutes.toString() + ':'
    }

    if (seconds < 10) {
        ans += '0' + rest.toString()
    } else {
        ans += rest.toString()
    }

    return ans
}

async function sliceVideoToImage(videoPath) {
    // const durationInSeconds = await getDuration(videoPath);
    // const durationInHMS = secondsToHMS(Math.floor(durationInSeconds / 2));
    // console.log(durationInHMS) 
    const cmd = 'ffmpeg'
    const args = [
        '-i',
        videoPath,
        '-vframes',
        1,
        '-s',
        '320x180',
        '-ss',
        "01:00:21",
        'output.png'
    ]
    const process = spawn(cmd, args)
    console.log(args.join(" "))
    process.stdout.on('data', function (data) {
        console.log(data)
    })

    process.stderr.setEncoding('utf8')
    process.stderr.on('data', function (data) {
        console.log(data)
    })

    process.on('close', function () {
        console.log('finished')
    })
}
 
// sliceVideoToImage(`D:/intermediate/cjod-249/cjod-249.mp4`)
// getDuration(`D:/intermediate/cjod-249/cjod-249.mp4`).then( seconds => {
//     const halfSeconds = Math.floor(seconds/2)
//     const halfInHMS = secondsToHMS(halfSeconds)
//     console.log(halfInHMS)
// })

sliceVideoToImage(`D:/intermediate/cjod-249/cjod-249.mp4`)