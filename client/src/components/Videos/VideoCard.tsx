import React, { useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Button,
} from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import { useStyles } from './style';
import { useVideoInfo } from '../../context';
import { useHistory } from 'react-router-dom';

export default function VideoCard({ information }) {
  const classes = useStyles();
  const history = useHistory();
  const { fileSize, fileName, _id } = information;

  const onPlay = () => {
    history.push(`/videos/${_id}`, information);
  };

  const onAddingToFavorites = (e) => {
    e.stopPropagation();
    console.log('clicked on favorites');
  };
  const onSharing = (e) => {
    e.stopPropagation();
    console.log('clicked on sharing');
  };
  return (
    <Card className={classes.cardBox} onClick={onPlay}>
      <CardContent>
        <Typography variant="h6" color="textPrimary" component="h2">
          {fileName}
        </Typography>

        <Typography variant="body2" color="textSecondary" component="p">
          {fileSize}
        </Typography>
      </CardContent>

      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" onClick={onAddingToFavorites}>
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share" onClick={onSharing}>
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
