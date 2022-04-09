import { RaxFileClient, RescanFilesAndUpdateDBRequest, RescanFilesAndUpdateDBResponse, SearchVideosRequest, SearchVideosResponse } from "./protos/types";
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

const raxFileClient = new protos.RaxFile("127.0.0.1:6969", grpc.credentials.createInsecure()) as RaxFileClient;


raxFileClient.SearchVideosAsync = (req: SearchVideosRequest): Promise<SearchVideosResponse> => {
    return new Promise((resolve, reject) => {
        raxFileClient.SearchVideos(req, (err: Error, response: SearchVideosResponse) => {
            if (err) {
                reject(err);
            }
            resolve(response);
        })
    })
}

raxFileClient.RescanFilesAndUpdateDBAsync = (req: RescanFilesAndUpdateDBRequest): Promise<RescanFilesAndUpdateDBResponse> => {
    return new Promise((resolve, reject) => {
        raxFileClient.RescanFilesAndUpdateDB(req, (err: Error, response: RescanFilesAndUpdateDBResponse) => {
            if (err) {
                reject(err);
            }
            resolve(response);
        })
    })
}


export default raxFileClient;



// client.SearchVideos({
//     Patterns: ["jul", "12"],
//     PageNo: 0,
//     PageSize: 0
// }, (err, response) => {
//     if (err) {
//         console.log(err);
//         return;
//     }
//     console.timeEnd("T")
//     console.log(response)
// })
// grpc_tools_node_protoc --js_out=import_style=es6,binary:. --grpc_out=grpc_js:. raxfile.proto


