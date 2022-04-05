const searchFiles = require("./common/searchFilesAsync");
const directoriesToBeExplored = require("./data/dirsTobeExplored");
const { query, saveVideos } = require("./common/mysql");

(async () => {
    // const { results } = await query("SELECT * from video_list");
    try {
        const data = await searchFiles(directoriesToBeExplored, []);
        console.log(data.length);
        await saveVideos(data);
        console.log('done');
    } catch (e) {
        console.log(e);
    }
    
})();