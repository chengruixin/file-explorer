import { useState } from 'react';
import { Container } from '@material-ui/core';
import './index.css';
import VideoCard from './VideoCard';
import { useStyles } from './style';
import { useHistory, useLocation } from 'react-router-dom';
import { fetchVideos } from '../../services';
import { useEffect } from 'react';
import { videoStore } from '../../store/videoStore'
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
function useVideos() {
  const history = useHistory();
  useEffect(() => {
    if (!videoStore?.videoList?.length) {
      const { location } = history;
      const params = new URLSearchParams(location.search);
      const searchVal = params.get('q') || '';
  
      fetchVideos({
        search: searchVal
      }).then(({ videoInfos }) => {
        videoStore.videoList = videoInfos;
      });
    }

  }, []);
  return videoStore.videoList;
}

const VideosView = observer(() => {
  const videoList = useVideos();
  const classes = useStyles();
  return (
    <>
      <Container maxWidth="lg">
        <ul className={classes.ul}>
          {videoList &&
            videoList.map((item) => (
              <VideoCard information={item} key={item._id} />
            ))}
        </ul>
      </Container>
    </>
  );
});


export default VideosView;
