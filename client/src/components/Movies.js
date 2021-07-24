import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    IconButton,
    Container,
} from '@material-ui/core'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ShareIcon from '@material-ui/icons/Share'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import './Movies.css'
import { useQueryDataContext } from '../context'

const useStyles = makeStyles((theme) => ({
    root: {
        width: 350,
        margin: theme.spacing(2),
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
}))

function Movies() {
    const [palyURL, setPlayURL] = useState(null)
    const [queryData] = useQueryDataContext();
    console.log(queryData)
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
                            <MovieCard
                                information={item}
                                key={key}
                                setPlayURL={setPlayURL}
                            />
                        )
                    })}
                </ul>
            </Container>
            {/* <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <ul
                    style={{
                        display: 'block',
                    }}
                >
                    {queryData.map((item, key) => {
                        return (
                            <MovieCard
                                information={item}
                                key={key}
                                setPlayURL={setPlayURL}
                            />
                        )
                    })}
                </ul>
            </div> */}
        </>
    )
}

function MovieCard({ information, setPlayURL }) {
    const maxFileNameLength = 16
    const classes = useStyles()
    const { handledFile, fileSize } = information
    let { fileName } = information
    fileName =
        fileName.length > maxFileNameLength
            ? fileName.substring(0, maxFileNameLength)
            : fileName
    const requestURL = `http://localhost:8080/videos?location=${handledFile}`
    const onPlay = () => {
        console.log('play : ', requestURL)
        setPlayURL(requestURL)
    }

    return (
        <Card className={classes.root}>
            <CardHeader
                title={fileName}
                subheader={fileSize}
                action={
                    <IconButton aria-label="watch video" onClick={onPlay}>
                        <PlayCircleOutlineIcon fontSize="large" />
                    </IconButton>
                }
            />
            <CardMedia
                className={classes.media}
                image="logo192.png"
                title="place-holder"
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {handledFile}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>
            </CardActions>
        </Card>
    )
}

function VideoDisplay({ palyURL, setPlayURL, className }) {
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
export default Movies
