export interface RaxFileService {
    SearchVideos: (a1:SearchVideosRequest, a2: (b1: Error, b2: SearchVideosResponse) => void) => void;
    SearchVideosAsync: (a1: SearchVideosRequest) => Promise<SearchVideosResponse>;

    RescanFilesAndUpdateDB: (a1: RescanFilesAndUpdateDBRequest, a2: (b1: Error, b2: RescanFilesAndUpdateDBResponse) => void) => void;
    RescanFilesAndUpdateDBAsync: (a2: RescanFilesAndUpdateDBRequest) => Promise<RescanFilesAndUpdateDBResponse>;
}

export interface SearchVideosRequest {
    Patterns: string[];
    PageNo: number;
    PageSize: number;
}

export interface SearchVideosResponse {
    FileInfos: FileInfo[]
}

export interface FileInfo {
    ID: number;
    FilePath: string;
    FileName: string;
    Extname: string;
    CreationTime: number;
    Size: number;
    Extra: string;
}

export interface RescanFilesAndUpdateDBRequest {}

export interface RescanFilesAndUpdateDBResponse {
    success: boolean;
}