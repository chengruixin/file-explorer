import React, { useEffect, useState, useContext } from 'react'

const QueryDataContext = React.createContext()
const VideoInfoContext = React.createContext()
export const useQueryData = () => useContext(QueryDataContext)
export const useVideoInfo = () => useContext(VideoInfoContext)

export default function IndexContext({ children }) {
    const [queryData, setQueryData] = useState([])
    const [videoInfo, setVideoInfo] = useState({})
    
    return (
        <QueryDataContext.Provider value={[queryData, setQueryData]}>
            <VideoInfoContext.Provider value={[videoInfo, setVideoInfo]}>
                {children}
            </VideoInfoContext.Provider>
        </QueryDataContext.Provider>
    )
}
