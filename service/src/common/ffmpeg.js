var spawn = require('child_process').spawn;

var cmd = '/home/ubuntu/bin/ffmpeg';

var args = [
    '-y', 
    '-i', '/home/ubuntu/input.flv',
    '-s', '640x480', 
    '-codec:a', 'aac', 
    '-b:a', '44.1k', 
    '-r', '15', 
    '-b:v', '1000k', 
    '-c:v','h264', 
    '-f', 'mp4', '/home/ubuntu/output.mp4'
];

var proc = spawn(cmd, args);

proc.stdout.on('data', function(data) {
    console.log(data);
});

proc.stderr.setEncoding("utf8")
proc.stderr.on('data', function(data) {
    console.log(data);
});

proc.on('close', function() {
    console.log('finished');
});

/**
 * @Copy from https://stackoverflow.com/questions/42012342/running-ffmpeg-via-nodejs-error
 * Anwsered and edited by Bulent Vural and Eliezser Steinbock
 */