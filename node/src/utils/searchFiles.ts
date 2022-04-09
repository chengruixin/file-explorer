import fs from 'fs';
import path from 'path';
import { FileInfo } from '../types';

const hasAllPatterns = (haystack: string, patterns: string[]): boolean =>
    !patterns.some(pattern => !haystack.includes(pattern))



const buildFileInfo = (filepath: string, stats: fs.Stats): FileInfo => ({
    basename: path.basename(filepath),
    extname: path.extname(filepath),
    filepath: filepath.split(path.sep).join(path.posix.sep),
    size: stats.size,
    birthTime: Math.floor(stats.birthtimeMs)
});

export const searchFilesOnDir = async (
    directory: string, searchPatterns: string[]
): Promise<FileInfo[]> => {
    const { readdir, stat } = fs.promises;

    const files = await readdir(directory);
    const filesStack = [];
    const fileInfos: FileInfo[] = [];

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
            const isValid =
                path.extname(filepath) !== '.torrent' 
                    && hasAllPatterns(filepath, searchPatterns);

            if (isValid) {
                fileInfos.push(buildFileInfo(filepath, stats));
            }
            
        }
    }

    return fileInfos;
}

export const searchFiles = async (
    directories: string[], searchPattern: string[] = []
): Promise<FileInfo[]> => {

    const fileInfosCollection = await Promise.all(
        directories.map(
            dir => searchFilesOnDir(dir, searchPattern)
        )
    );

    // flat fileinfos' collection
    const resultOfFileInfos: FileInfo[] = [];

    for (const fileInfos of fileInfosCollection) {
        for (const fileInfo of fileInfos) {
            resultOfFileInfos.push(fileInfo);
        }
    }
    return resultOfFileInfos;
}