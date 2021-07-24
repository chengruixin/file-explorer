import React, { useEffect } from 'react'
import {
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    IconButton,
} from '@material-ui/core'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ShareIcon from '@material-ui/icons/Share'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import { useStyles } from './style'
import { useVideoURL } from '../../context'
import { useHistory } from 'react-router'

export default function VideoCard({ information, setPlayURL }) {
    const history = useHistory()
    const maxFileNameLength = 16
    const classes = useStyles()
    const { handledFile, fileSize } = information
    let { fileName } = information
    fileName =
        fileName.length > maxFileNameLength
            ? fileName.substring(0, maxFileNameLength)
            : fileName
    const requestURL = `http://localhost:8080/videos?location=${handledFile}`
    const [videoURL, setVideoURL] = useVideoURL()

    const onPlay = () => {
        setVideoURL(requestURL)
        history.push('/video')
    }

    useEffect(() => {
        console.log(videoURL)
    }, [videoURL])

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
