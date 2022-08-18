import raxFileService from "../grpc";
import { FileInfo } from "../grpc/protos/types";

const mapIDToFileInfo = new Map<string, FileInfo>();
const MAX_CACHED = 50;
export const getFileInfoByID = async (id: string) => {
    if (mapIDToFileInfo.has(id)) {
        return mapIDToFileInfo.get(id);
    }

    const { FileInfo } = await raxFileService.SearchVideoByIDAsync({
        ID: parseInt(id, 10)
    });

    if (mapIDToFileInfo.size > MAX_CACHED) {
        for (const key of mapIDToFileInfo.keys()) {
            mapIDToFileInfo.delete(key);
            break;
        }
    }

    mapIDToFileInfo.set(id, FileInfo);

    return FileInfo;
}