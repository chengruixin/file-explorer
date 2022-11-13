import React, { useEffect, useState } from 'react';
import ReactDom from 'react-dom';
import {
  Paper,
  InputBase,
  IconButton,
  AppBar,
  Toolbar,
  colors,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import { fetchVideos, refreshData } from '../../services';
import { useHistory, useRouteMatch } from 'react-router-dom';
import withLoading from '../HOC/withLoading';
import styles from './index.module.css';
import { videoStore } from '../../store/videoStore';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: colors.lightBlue[600],
  },
  paperWrapper: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 1200,
    height: 40,
  },
  toolBar: {
    display: 'flex',
    justifyContent: 'center',
    height: 80
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
    // height: 10,
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const RefreshIconWithLoading = withLoading(RefreshIcon);
  const handleRefresh = () => {
    setIsLoading(true);

    refreshData().finally(() => {
      setIsLoading(false);
    });
  };
  return (
    <AppBar position="sticky" className={classes.appBar}>
      <Toolbar className={classes.toolBar}>
        <div className={styles['navbar-left-box']}></div>
        <SearchInput />
        <div className={styles['navbar-right-box']}>
          <IconButton onClick={handleRefresh} disabled={isLoading}>
            <RefreshIconWithLoading
              isLoading={isLoading}
              size={18}
              className={styles['white-text']}
            />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}

function SearchInput() {
  const classes = useStyles();
  const history = useHistory();
  const [isSearching, setIsSearching] = useState(false);
  const SearchIconWithLoading = withLoading(SearchIcon);
  const [inputVal, setInputVal] = useState("");
  const handleSearchClick = async () => {
    try {
      if (isSearching || inputVal.length === 0) {
        return;
      }

      setIsSearching(true);
      const { videoInfos } = await fetchVideos({
        search: inputVal
      });
      setIsSearching(false);
      videoStore.videoList = videoInfos;
      history.push(`/videos?q=${inputVal}`);
    } catch (err) {
      setIsSearching(false);
      console.log(err);
    }
  };

  return (
    <Paper component="div" className={classes.paperWrapper}>
      <InputBase
        value={inputVal}
        onChange={(e) => {
          setInputVal(e.target.value);
        }}
        className={classes.input}
        id="search"
        placeholder="Try to give a search"
        inputProps={{ 'aria-label': 'Try to give a search' }}
        onKeyPressCapture={(e) => {
          if (e.code === 'Enter') {
            handleSearchClick();
          }
        }}
      />

      <IconButton
        type="submit"
        className={classes.iconButton}
        aria-label="search"
        onClick={handleSearchClick}
        disabled={isSearching}
      >
        <SearchIconWithLoading
          isLoading={isSearching}
          size={18}
        />
      </IconButton>
    </Paper>
  );
}
