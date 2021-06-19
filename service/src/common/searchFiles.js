const fs = require('fs');
const { readFile, readdir, stat } = fs;
const path = require("path");
const streamWriter = fs.createWriteStream('./results');
// const {findExactItems} = require("./../libs/raxSearch/raxSearch.dev").exactMatcher;

// var searcher;

const searchFiles = function (currentPath, searchItem, depth) {

    // if(!searcher){
    //     searcher = findExactItems(searchItem);
    //     // console.log("once")
    // }
    
    readdir(currentPath, (err, files) => {
        if(err) {
            console.log(err);
            return;
        };
    
        for(let i = 0; i < files.length; i++) {
            let filepath = path.join(currentPath, files[i]);
            stat(filepath, (err, stats) => {
                if(err) {
                    console.log(err);
                }
                if(!stats) return;

                const isDir = stats.isDirectory()
    
                if(isDir) {
                    searchFiles(filepath, searchItem, depth + 1);
                } else {
                    const fileSize = stats.size / 1024 / 1024 / 1024;
                    const extname = path.extname(filepath);
                    const filename = files[i];

                    if(extname === ".torrent") {
                        return;
                    }

                    if(filename.toLowerCase().indexOf(searchItem) === -1) {
                        return;
                    }

                    // if(searcher.findFirst(filename.toLowerCase()) === -1) {
                    //     return;
                    // }

                    streamWriter.write("name : " + files[i] + "\n");
                    streamWriter.write("path : " + filepath + "\n");
                    streamWriter.write("type : " + path.extname(filepath) + "\n");
                    streamWriter.write("size : " + fileSize.toFixed(2) + " GB" + "\n\n");

                   
                }
                
            })
        }
    })
}

module.exports = searchFiles;