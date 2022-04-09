import { FileInfo } from "../types";
import { VideoListTableStruct } from "./mysql";

export const sizeInGB = (size: number): string =>
(size / 1024 / 1024 / 1024).toFixed(2) + " GB";

export const turnVideoListTableStruct2FileInfo = (struct: VideoListTableStruct): FileInfo => ({
    id: struct.id,
    basename: struct.file_name,
    extname: struct.ext_name,
    filepath: struct.file_path,
    size: struct.size,
    birthTime: struct.modification_time,
})