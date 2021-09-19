import React, { useState } from 'react'
import { Container } from '@material-ui/core'
import './index.css'
import VideoCard from './VideoCard'
import { useStyles } from './style'
import { useLocation } from 'react-router'

function Videos() {
    const { state } = useLocation()
    const classes = useStyles()
    console.log(state)
    return (
        <>
            <Container maxWidth="lg">
                <ul className={classes.ul}>
                    {state &&
                        state.map((item) => (
                            <VideoCard information={item} key={item._id} />
                        ))}
                </ul>
            </Container>
        </>
    )
}

export default Videos
