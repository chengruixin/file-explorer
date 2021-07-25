export const fetchVideos = async (val) => {
    const res = await fetch('https://localhost:8443/query?search=' + val)
    const data = await res.json()
    return data
}
