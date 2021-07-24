export const fetchVideos = async (val) => {
    const res = await fetch('/query?search=' + val)
    const data = await res.json()
    return data
}
