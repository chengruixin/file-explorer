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
const streamWrite = (streamWriter, fileinfo) => {
    // do nothing here
    // streamWriter.write("name : " + basename + "\n");
    // streamWriter.write("path : " + filepath + "\n");
    // streamWriter.write("type : " + extname + "\n");
    // streamWriter.write("size : " + size + "\n\n");
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
            const filepath = filesStack.shift();
            const stats = await stat(filepath);

            if(stats.isDirectory()){
                const files = await readdir(filepath);
                for(let i = 0; i < files.length; i++){
                    filesStack.push(path.join(filepath, files[i]));
                }
            } else {
                // const size = (stats.size / 1024 / 1024 / 1024).toFixed(2) + " GB";
                const extname = path.extname(filepath);
                const basename = path.basename(filepath)
                const birthTime = Math.floor(stats.birthtimeMs);
                const isValid = extname !== '.torrent' && hasAllPatterns(searchers, filepath);
                if (!isValid) {
                    continue;
                }
            
                const fileinfo = {
                    basename,
                    extname,
                    filepath,
                    size: stats.size,
                    birthTime
                };
                matchedItems.push(fileinfo);
                if (streamWriter) {
                    streamWrite(streamWriter, fileinfo);
                }
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