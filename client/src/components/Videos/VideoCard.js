import React, { useEffect } from 'react'
import {
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    IconButton,
    Button,
} from '@material-ui/core'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ShareIcon from '@material-ui/icons/Share'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import { useStyles } from './style'
import { useVideoInfo } from '../../context'
import { useHistory } from 'react-router'

export default function VideoCard({ information, setPlayURL }) {
    const history = useHistory()
    const maxFileNameLength = 16
    const classes = useStyles()
    const { handledFile, fileSize } = information
    let { fileName } = information
    // fileName =
    //     fileName.length > maxFileNameLength
    //         ? fileName.substring(0, maxFileNameLength)
    //         : fileName
    const requestURL = `http://localhost:8080/videos?location=${handledFile}`
    const [videoInfo, setVideoInfo] = useVideoInfo()

    const onPlay = () => {
        setVideoInfo({
            url: requestURL,
            fileName: information.fileName,
            location: handledFile,
            fileSize: fileSize,
        })
        history.push('/video')
        // console.log('clicked on card')
    }

    const onAddingToFavorites = (e) => {
        e.stopPropagation()
        console.log('clicked on favorites')
    }
    const onSharing = (e) => {
        e.stopPropagation()
        console.log('clicked on sharing')
    }
    return (
        <Card className={classes.cardBox} onClick={onPlay}>
            {/* <CardHeader
                title={fileName}
                subheader={fileSize}
                action={
                    <IconButton aria-label="watch video" onClick={onPlay}>
                        <PlayCircleOutlineIcon fontSize="large" />
                    </IconButton>
                }
            /> */}

            {/* <CardMedia
                    className={classes.media}
                    image="logo192.png"
                    title="place-holder"
                /> */}
            <CardContent>
                <Typography variant="h6" color="textPrimary" component="h2">
                    {fileName}
                </Typography>

                <Typography variant="body2" color="textSecondary" component="p">
                    {fileSize}
                </Typography>
            </CardContent>

            <CardActions disableSpacing>
                <IconButton
                    aria-label="add to favorites"
                    onClick={onAddingToFavorites}
                >
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share" onClick={onSharing}>
                    <ShareIcon />
                </IconButton>
            </CardActions>
        </Card>
    )
}
