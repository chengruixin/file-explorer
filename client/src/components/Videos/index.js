import React, { useState } from 'react'
import { Container } from '@material-ui/core'
import './index.css'
import { useQueryDataContext } from '../../context'
import VideoDisplay from '../PlayVideo'
import VideoCard from './VideoCard'

function Videos() {
    const [palyURL, setPlayURL] = useState(null)
    const [queryData] = useQueryDataContext()

    return (
        <>
            {/* <MovieCard /> */}
            <VideoDisplay
                palyURL={palyURL}
                setPlayURL={setPlayURL}
                className={palyURL ? 'show-flex' : 'hide'}
            />
            <Container maxWidth="lg">
                <ul
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'start',
                        alignItems: 'stretch',
                        // flexDirection : 'revert'
                    }}
                >
                    {queryData.map((item, key) => {
                        return (
                            <VideoCard
                                information={item}
                                key={key}
                                setPlayURL={setPlayURL}
                            />
                        )
                    })}
                </ul>
            </Container>
        </>
    )
}

export default Videos
