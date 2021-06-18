const fs = require('fs');
const { readFile, readdir, stat } = fs;
const path = require("path");
const streamWriter = fs.createWriteStream('./results');

const searchFiles = function (currentPath, searchItem) {
    readdir(currentPath, (err, files) => {
        if(err) throw err;
    
        for(let i = 0; i < files.length; i++) {
            let filepath = path.join(currentPath, files[i]);
            stat(filepath, (err, stats) => {
                if(err) {
                    console.log(err);
                }
                if(!stats) return;

                const isDir = stats.isDirectory()
    
                if(isDir) {
                    searchFiles(filepath, searchItem);
                } else {
                    const fileSize = stats.size / 1024 / 1024 / 1024;
                    const extname = path.extname(filepath);
                    const filename = files[i];

                    if(extname === ".torrent" || extname === '.zip') {
                        return;
                    }

                    if(filename.toLowerCase().indexOf(searchItem) === -1) {
                        return;
                    }

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