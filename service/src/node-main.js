const searchFiles = require("./common/searchFilesAsync");
const path = require("path");
const startDirectories = [
    "C:/迅雷下载",
    "D:/downloads",
    "D:/Games",
    "D:/intermediate",
    "D:/movies",
    "D:/迅雷下载",
    "G:/迅雷下载",
    "H:/movies",
    "H:/Theatre/wifes",
    "J:/Downloads",
    "K:/BaiduNetdiskDownload",
    "K:/MoviesFromDrive",
    "K:/迅雷下载"
]
const args = process.argv;
const streamWriter = require("fs").createWriteStream('./.results');

(function main(){
    if(args.length <= 2) {
        console.log("args is not enough, system quit");
        return;
    }
    console.time("test")
    let promises = [];
    for(let i = 2; i < args.length; i++){
        const searchItem = args[i];
        
        for(let i = 0; i < startDirectories.length; i++) {
            // await searchFiles(startDirectories[i], searchItem)
            promises.push(searchFiles(startDirectories[i], searchItem, streamWriter))
        }
    }

    Promise.all(promises).then(data=>{
        // console.log(data);
        streamWriter.end();
        console.timeEnd("test")
    })
})();


