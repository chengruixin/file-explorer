import raxFileClient from "./grpc";

(async () => {
    try {
        const res = await raxFileClient.SearchVideosAsync({
            Patterns: ["jul"],
            PageNo: 0,
            PageSize: 0
        });
    
        console.log(res)
    } catch(e) {
        console.log(e);
    }
    
})()