import React, { useEffect, useState, useContext } from 'react'

const QueryDataContext = React.createContext()
const VideoURLContext = React.createContext()
export const useQueryData = () => useContext(QueryDataContext)
export const useVideoURL = () => useContext(VideoURLContext)

export default function IndexContext({ children }) {
    const [queryData, setQueryData] = useState([])
    const [videoURL, setVideoURL] = useState(null)

    return (
        <QueryDataContext.Provider value={[queryData, setQueryData]}>
            <VideoURLContext.Provider value={[videoURL, setVideoURL]}>
                {children}
            </VideoURLContext.Provider>
        </QueryDataContext.Provider>
    )
}
