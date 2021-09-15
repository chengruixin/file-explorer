import axios from 'axios'

export const fetchVideos = async (val) => {
    try {
        const res = await axios.get('/query?search=' + val)
        return res;
    } catch (err) {
        throw err
    }
}
