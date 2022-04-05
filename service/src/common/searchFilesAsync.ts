import fs from 'fs';
import path from 'path';

export interface FileInfo {
    basename : string;
    extname: string;
    filepath: string;
    size: number; // in bytes
    birthTime: number; // timestamp
}

const hasAllPatterns = (haystack: string, patterns: string[]): boolean =>
    !patterns.some(pattern => !haystack.includes(pattern))

const sizeInGB = (size: number): string =>
    (size / 1024 / 1024 / 1024).toFixed(2) + " GB";

const streamWrite = (streamWriter: WritableStreamDefaultWriter, fileinfo) => {
    // do nothing here
    // streamWriter.write("name : " + basename + "\n");
    // streamWriter.write("path : " + filepath + "\n");
    // streamWriter.write("type : " + extname + "\n");
    // streamWriter.write("size : " + size + "\n\n");
}

export const searchFilesFromOneDirectory = async (directory, searchPatterns, streamWriter) => {
    const { readdir, stat } = fs.promises;

    const files = await readdir(directory);
    const filesStack = [];
    const matchedItems = [];

    for (let i = 0; i < files.length; i++) {
        let filePath = path.join(directory, files[i]);
        filesStack.push(filePath);
    }

    while (filesStack.length > 0) {
        const filepath = filesStack.shift();
        const stats = await stat(filepath);
        if (stats.isDirectory()) {
            const files = await readdir(filepath);
            for (let i = 0; i < files.length; i++) {
                filesStack.push(path.join(filepath, files[i]));
            }
        } else {
            // const size = (stats.size / 1024 / 1024 / 1024).toFixed(2) + " GB";
            const extname = path.extname(filepath);
            const basename = path.basename(filepath)
            const birthTime = Math.floor(stats.birthtimeMs);
            const isValid = extname !== '.torrent' && hasAllPatterns(filepath, searchPatterns);
            if (!isValid) {
                continue;
            }

            const unixPath = filepath.split(path.sep).join(path.posix.sep)

            const fileinfo = {
                basename,
                extname,
                filepath: unixPath,
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
}

export const searchFiles = (directories, searchPattern, streamWriter) => {
    return Promise.all(
        directories.map(dir => {
            return searchFilesFromOneDirectory(dir, searchPattern, streamWriter)
        })
    ).then(matchedItemBundles => {
        //flat matchedItemBundles
        if (matchedItemBundles.length <= 0) {
            return [];
        }

        let matchedItems = matchedItemBundles[0];

        for (let i = 0; i < matchedItemBundles.length; i++) {
            matchedItems = matchedItems.concat(matchedItemBundles[i]);
        }

        return matchedItems;
    }).catch(err => {
        throw err;
    })
}