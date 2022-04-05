const searchFiles = require("./utils/searchFiles");
const path = require("path");
const directoriesToBeExplored = require("./data/dirsTobeExplored");
const args = process.argv;
const streamWriter = require("fs").createWriteStream('./.results');

(function main(){
    if(args.length <= 2) {
        console.info("args is not enough, system quit");
        return;
    }


    console.time("test")
    searchFiles(directoriesToBeExplored, args.slice(2), streamWriter)
        .then(data => {
            console.timeEnd("test");
        })
})();


