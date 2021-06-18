



const searchFiles = require("./searchFiles");
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
    "K:/迅雷下载",
    "E:/迅雷下载"
]
const args = process.argv;

(function main(){
    if(args.length <= 2) {
        console.log("args is not enough, system quit");
        return;
    }

    for(let i = 2; i < args.length; i++){
        const searchItem = args[i];
        for(let i = 0; i < startDirectories.length; i++) {
            searchFiles(startDirectories[i], searchItem);
        }
    }
})();


