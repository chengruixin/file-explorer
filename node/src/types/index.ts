export interface FileInfo {
    id?: number;
    basename : string;
    extname: string;
    filepath: string;
    size: number; // in bytes
    birthTime: number; // timestamp
}