import axios from 'axios'

export const fetchVideos = async (val) => {
    try {
        const { data, status } = await axios.get('/api/videos?search=' + val)
        
        if (status !== 200) {
            return {};
        }

        return data;
    } catch (err) {
        throw err
    }
}


export const refreshData = async () => {
    await axios.post('/refresh')
}