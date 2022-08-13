import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Divider,
  Box,
  Button,
  IconButton,
  Paper,
} from '@material-ui/core';
import { useVideoInfo } from '../../../context';
import { useStyles } from './style';
import Player from './Player';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import FileCopyIcon from '@material-ui/icons/FileCopy';

export default function VideoDisplay() {
  const { state } = useLocation();
  const { _id, fileName, fileSize, handledFile } = state;
  const classes = useStyles();
  return (
    <Container>
      <main>
        <Player url={`/api/videos/${_id}`} />

        <Typography variant="h6" component="h1">
          {fileName}
        </Typography>
        <Box className={classes.subInfo}>
          <Typography className={classes.flexGrow}>{fileSize}</Typography>
          <IconButton>
            <FavoriteBorderIcon />
          </IconButton>
          <IconButton>
            <BookmarkBorderIcon />
          </IconButton>
        </Box>

        <Divider light />
        <Box className={classes.description}>
          <Typography className={classes.shallowText + ' ' + classes.flexGrow}>
            {handledFile}
          </Typography>

          {/* <Paper> */}
          <Button>
            <FileCopyIcon className={classes.shallowText} />
          </Button>
          {/* </Paper> */}
        </Box>
        <Divider light />
      </main>
    </Container>
  );
}
