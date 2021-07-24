import React, { useState } from 'react'
import { Container } from '@material-ui/core'
import './index.css'
import { useQueryData } from '../../context'
import VideoCard from './VideoCard'
import { useStyles } from './style'

function Videos() {
    const [palyURL, setPlayURL] = useState(null)
    const [queryData] = useQueryData()
    const classes = useStyles()

    return (
        <>
            <Container maxWidth="lg">
                <ul className={classes.ul}>
                    {queryData.map((item, key) => (
                        <VideoCard
                            information={item}
                            key={key}
                            setPlayURL={setPlayURL}
                        />
                    ))}
                </ul>
            </Container>
        </>
    )
}

export default Videos
