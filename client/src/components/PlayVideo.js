import React, {useEffect, useState} from 'react'

export default function VideoDisplay({ palyURL, setPlayURL, className }) {
    console.log(className)
    const handleClose = () => {
        const video = document.querySelector('#video-overlay video')
        console.log(video)
        video.pause()
        video.currentTime = 0
        setPlayURL(null)
    }

    useEffect(() => {
        console.log('loaded')

        return () => {
            console.log('unloaded')
        }
    })
    return (
        <div
            className={className}
            id="video-overlay"
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                zIndex: 100,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(120,120,120, 0.7)',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    width: '55%',
                }}
            >
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
                        src={palyURL}
                    ></video>
                </main>

                {/* <footer>43 : {palyURL}</footer> */}
            </div>
        </div>
    )
}