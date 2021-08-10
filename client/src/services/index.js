import axios from 'axios'

export const fetchVideos = async (val) => {
    try {
        const res = await axios.get('http://localhost:8080/query?search=' + val) // incorrect
        // const res = await axios.get('http://localhost:8080/query?search=' + val) // correct
        return res;

        //https : https://localhost:8443/query?search=
        // const res = await fetch('http://localhost:8080/query?search=' + val)
        // const data = await res.json()
        // return data
    } catch (err) {
        throw err
    }
}
