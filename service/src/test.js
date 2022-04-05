const searchFiles = require("./common/searchFilesAsync");
const directoriesToBeExplored = require("./data/dirsTobeExplored");
const { query, updateNewVideos } = require("./common/mysql");
const streamWriter = require("fs").createWriteStream('./.results');

const str = 'F:/newworld/259luxu-1416-C/最新情报.mp4';
(async () => {
    // const { results } = await query("SELECT * from video_list");
    try {
        // await updateNewVideos();

        const data = await searchFiles(directoriesToBeExplored, [])
        let count = 0;
        for (const d of data) {
            if (d.filepath === str) {
                console.log('found one');
                count++;
            }
        }

        console.log(count)
    } catch (e) {
        console.log(e);
        streamWriter.write(JSON.stringify(e));
    }
    
})();

// select count(*) from (select file_name, file_path, count(*) as count  from video_list where ext_name = ".mp4"  group by file_path having count(*) > 1);