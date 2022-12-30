import axios from 'axios'
import { VideoInfoT } from '../types';

export const fetchVideos = async ({ search, id } : {
  search?: string;
  id?: string;
}): Promise<{
  videoInfos: Array<VideoInfoT>;
}> => {
  try {
    const { data, status } = await axios.get('/api/videos', {
      params: {
        search,
        id
      }
    })

    if (status !== 200) {
      return {} as any;
    }

    return data;
  } catch (err) {
    throw err
  }
}


export const refreshData = async () => {
  await axios.post('/api/videos/refresh')
}