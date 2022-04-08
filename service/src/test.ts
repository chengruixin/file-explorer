import { searchFiles } from './utils/searchFiles';
import { VIDEO_DIRS } from './utils/consts';
import { updateVideosSoft, updateVideosHard, searchVideos, findVideoByID } from './utils/mysql';

(async () => {
    console.time('Time')
    const videos = await searchFiles(VIDEO_DIRS);

    console.log(videos.length, videos[0]);
    console.timeEnd('Time')

})();


(async () => {
    // const videos = await searchVideos(['jul', '12']);
    // // await updateVideosHard(fileInfos);
    // if (videos.length > 0) {
    //     const res = await findVideoByID(videos[0].id);
    //     console.log(videos.length, res);
    // }
    // console.log(videos);
})();
// select count(*) from (select file_name, file_path, count(*) as count  from video_list where ext_name = ".mp4"  group by file_path having count(*) > 1);