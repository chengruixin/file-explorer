const fs = require("fs");
const fsPromises = fs.promises;
const { readdir, stat } = fsPromises;
const path = require("path");
const {findExactItems} = require("../../libs/raxSearch/raxSearch.dev").exactMatcher;

const hasPattern = (searcher, pattern) => searcher.findFirst(pattern.toLowerCase()) >= 0;

async function searchFiles (currentPath, searchPattern, streamWriter) {
    try {
        const files = await readdir(currentPath);
        const stack = [];
        const searcher = findExactItems(searchPattern);

        for(let i = 0; i < files.length; i++){
            let filePath = path.join(currentPath, files[i]);
            stack.push(filePath);
        }
       
        while (stack.length > 0) {
            const handledFile = stack.shift();
            const stats = await stat(handledFile);


            if(stats.isDirectory()){
                const files = await readdir(handledFile);
                for(let i = 0; i < files.length; i++){
                    stack.push(path.join(handledFile, files[i]));
                }
            } else {
                const fileSize = stats.size / 1024 / 1024 / 1024;
                const extname = path.extname(handledFile);
                const fileName = path.basename(handledFile)

                if(extname === ".torrent") {
                    continue;
                }

                // if(fileName.toLowerCase().indexOf(searchPattern) === -1) {
                //     continue;
                // }
                if(!hasPattern(searcher, handledFile)){
                    continue;
                }

                streamWriter.write("name : " + fileName + "\n");
                streamWriter.write("path : " + handledFile + "\n");
                streamWriter.write("type : " + extname + "\n");
                streamWriter.write("size : " + fileSize.toFixed(2) + " GB" + "\n\n");
            }
        }

        return "done";

    } catch (e) {
        console.log(e);
        console.log("a")
    }
}

module.exports = searchFiles;