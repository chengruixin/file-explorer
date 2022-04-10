import axios from 'axios'

export const fetchVideos = async (val) => {
    try {
        const res = await axios.get('/videos?search=' + val)
        console.log(res)
        return res
    } catch (err) {
        throw err
    }
}


export const refreshData = async () => {
    await axios.post('/refresh')
}