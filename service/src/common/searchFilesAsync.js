const fs = require("fs");
const fsPromises = fs.promises;
const { readdir, stat } = fsPromises;
const path = require("path");
const { findExactItems } = require("../../libs/raxSearch/raxSearch.dev").exactMatcher;

const hasPattern = (searcher, pattern) => searcher.findFirst(pattern.toLowerCase()) >= 0;
const hasAllPatterns = (searchers, pattern) => {
    for(let i = 0; i < searchers.length; i++){
        if(!hasPattern(searchers[i], pattern)) {
            return false;
        }
    }

    return true;
}
async function searchFilesFromOneDirectory (directory, searchPatterns, streamWriter) {
    try {
        const files = await readdir(directory);
        const filesStack = [];
        const searchers = searchPatterns.map(p => findExactItems(p));
        const matchedItems = [];

        for(let i = 0; i < files.length; i++){
            let filePath = path.join(directory, files[i]);
            filesStack.push(filePath);
        }
       
        while (filesStack.length > 0) {
            const handledFile = filesStack.shift();
            const stats = await stat(handledFile);

            if(stats.isDirectory()){
                const files = await readdir(handledFile);
                for(let i = 0; i < files.length; i++){
                    filesStack.push(path.join(handledFile, files[i]));
                }
            } else {
                const fileSize = (stats.size / 1024 / 1024 / 1024).toFixed(2) + " GB";
                const extname = path.extname(handledFile);
                const fileName = path.basename(handledFile)
                
                if(extname === ".torrent") {
                    continue;
                }

                // if(fileName.toLowerCase().indexOf(searchPattern) === -1) {
                //     continue;
                // }

                if(!hasAllPatterns(searchers, handledFile)){
                    continue;
                }

                if (streamWriter) {
                    streamWriter.write("name : " + fileName + "\n");
                    streamWriter.write("path : " + handledFile + "\n");
                    streamWriter.write("type : " + extname + "\n");
                    streamWriter.write("size : " + fileSize + "\n\n");
                }

                matchedItems.push({
                    fileName,
                    handledFile,
                    extname,
                    fileSize
                })
                
            }
        }

        return matchedItems;

    } catch (e) {
        console.log(e);
    }
}

function searchFiles (directories, searchPattern, streamWriter) {
    return Promise.all(
        directories.map(dir  => {
            return searchFilesFromOneDirectory(dir, searchPattern, streamWriter)
        })
    ).then( matchedItemBundles => {
        //flat matchedItemBundles
        if (matchedItemBundles.length <= 0) {
            return [];
        }

        let matchedItems = matchedItemBundles[0];

        for(let i = 0; i < matchedItemBundles.length; i++){
            matchedItems = matchedItems.concat(matchedItemBundles[i]);
        }

        return matchedItems;
    }).catch( err => {
        throw err;
    })
}
module.exports = searchFiles;