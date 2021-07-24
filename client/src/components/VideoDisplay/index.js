import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Container } from '@material-ui/core'
import { useVideoURL } from '../../context'

export default function VideoDisplay() {
    const [videoURL, setVideoURL] = useVideoURL()
    const history = useHistory()

    useEffect(() => {
        console.log(videoURL);
        // if (!videoURL) history.push('/')
    }, [])
    const handleClose = () => {
        // const video = document.querySelector('#video-overlay video')
        // console.log(video)
        // video.pause()
        // video.currentTime = 0
        // setPlayURL(null)
        console.log('click')
    }

    return (
        <Container>
            <header>
                <button onClick={handleClose}>Close</button>
            </header>

                <main>
                    <video
                        style={{
                            width: '100%',
                        }}
                        controls={true}
                        playsInline
                        type="video/mp4"
                        src={videoURL}
                    ></video>
                </main>
        </Container>
    )
}
