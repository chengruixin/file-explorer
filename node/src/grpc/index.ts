import { RaxFileService, RescanFilesAndUpdateDBRequest, RescanFilesAndUpdateDBResponse, SearchVideoByIDRequest, SearchVideoByIDResponse, SearchVideosRequest, SearchVideosResponse } from "./protos/types";
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, "./protos/raxfile.proto")
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true
    }
);

const protos = grpc.loadPackageDefinition(packageDefinition).protos as any;

const raxFileService = new protos.RaxFile("127.0.0.1:6969", grpc.credentials.createInsecure()) as RaxFileService;


raxFileService.SearchVideosAsync = (req: SearchVideosRequest): Promise<SearchVideosResponse> => {
    return new Promise((resolve, reject) => {
        raxFileService.SearchVideos(req, (err: Error, response: SearchVideosResponse) => {
            if (err) {
                reject(err);
            }
            resolve(response);
        })
    })
}

raxFileService.SearchVideoByIDAsync = (req: SearchVideoByIDRequest): Promise<SearchVideoByIDResponse> => {
    return new Promise((resolve, reject) => {
        raxFileService.SearchVideoByID(req, (err: Error, response: SearchVideoByIDResponse) => {
            if (err) {
                reject(err);
            }
            resolve(response);
        })
    })
}

raxFileService.RescanFilesAndUpdateDBAsync = (req: RescanFilesAndUpdateDBRequest): Promise<RescanFilesAndUpdateDBResponse> => {
    return new Promise((resolve, reject) => {
        raxFileService.RescanFilesAndUpdateDB(req, (err: Error, response: RescanFilesAndUpdateDBResponse) => {
            if (err) {
                reject(err);
            }
            resolve(response);
        })
    })
}



export default raxFileService;
