import { useEffect, useLayoutEffect, useRef } from 'react'
import { useStyles } from './style'

const volumeChange = 0.03
const videoProgressChange = 3

export default function Player({ url }) {
    const classes = useStyles()
    const videoRef = useRef()

    const handleEvents = (e) => {
        e.preventDefault()
        const { keyCode } = e
        if (keyCode === 37) {
            videoRef.current.currentTime -= videoProgressChange
        } else if (keyCode === 39) {
            videoRef.current.currentTime += videoProgressChange
        } else if (keyCode === 38) {
            const currentVolume = videoRef.current.volume

            if (currentVolume + volumeChange <= 1) {
                videoRef.current.volume += volumeChange
            } else {
                videoRef.current.volume = 1
            }
        } else if (keyCode === 40) {
            const currentVolume = videoRef.current.volume

            if (currentVolume - volumeChange >= 0) {
                videoRef.current.volume -= volumeChange
            } else {
                videoRef.current.volume = 0
            }
        } else if (keyCode === 32) {
            if (videoRef.current.paused) {
                videoRef.current.play()
            } else {
                videoRef.current.pause()
            }
        }
    }

    useLayoutEffect(() => {
        videoRef.current.volume = 0
    }, [])

    return (
        <video
            className={classes.verticalMargin}
            style={{
                width: '100%',
            }}
            controls
            autoPlay
            crossOrigin
            onKeyDownCapture={handleEvents}
            ref={videoRef}
        >
            <source src={url} type="video/mp4" />
            <source src={url} type="video/webm" />
            <p>not supported</p>
        </video>
    )
}
