import { useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Divider,
  Box,
  Button,
  IconButton,
} from '@material-ui/core';
import { useStyles } from './style';
import Player from './Player';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIos from '@material-ui/icons/ArrowForwardIos';

import FileCopyIcon from '@material-ui/icons/FileCopy';
// import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import { videoStore } from '../../../store/videoStore';
import { fetchVideos } from '../../../services';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { VideoInfoT } from '../../../types';

function useVideoInfo() {
  const id = videoStore.currentVideoID;
  const { id: idFromParams } = useParams<{ id: string }>();
  const [info, setInfo] = useState<VideoInfoT | null>();

  useEffect(() => {
    if (!videoStore?.videoList?.length) {
      return;
    }
    for (let i = 0; i < videoStore.videoList.length; i++) {
      if (videoStore.videoList[i]._id === id) {
        setInfo(videoStore.videoList[i]);
      }
    }
  }, [id]);

  if (!info) {
    fetchVideos({
      id: idFromParams,
    }).then(({ videoInfos }) => {
      setInfo(videoInfos[0]);
    });
  }
  return info;
}

const VideoDisplay = observer(() => {
  const classes = useStyles();
  const videoInfo = useVideoInfo();

  const currentIdx = videoStore.videoList.findIndex(
    (data) => data._id === videoStore.currentVideoID
  );

  const history = useHistory();

  if (!videoInfo) {
    return <div>Loading...</div>;
  }

  const { _id, fileName, handledFile, fileSize } = videoInfo;

  console.log('render', currentIdx);
  return (
    <Container maxWidth="xl">
      <main>
        <Player url={`/api/videos/${_id}`} />

        {currentIdx >= 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '16px 0',
            }}
          >
            <Button
              variant="contained"
              startIcon={<ArrowBackIos />}
              disabled={currentIdx === 0}
              onClick={() => {
                const id = videoStore.videoList[currentIdx - 1]._id;
                history.push(`/videos/${id}`);
                videoStore.currentVideoID = id;
                console.log(videoStore.currentVideoID, id);
              }}
            >
              Prev
            </Button>
            <Button
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIos />}
              disabled={currentIdx === videoStore.videoList.length - 1}
              onClick={() => {
                const id = videoStore.videoList[currentIdx + 1]._id;
                history.push(`/videos/${id}`);
                videoStore.currentVideoID = id;
              }}
            >
              Next
            </Button>
          </div>
        )}

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
});

export default VideoDisplay;
