import React, { useEffect } from 'react'
import {
    Paper,
    InputBase,
    IconButton,
    AppBar,
    Toolbar,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import { useQueryData } from '../context'
import { fetchVideos } from '../services'
import { useHistory, useRouteMatch } from 'react-router'

const useStyles = makeStyles((theme) => ({
    appBar: {
        backgroundColor: '#ffc1e3',
    },
    paperWrapper: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
    },
    toolBar: {
        display: 'flex',
        justifyContent: 'center',
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
        // height: 10,
    },
}))

export default function NavBar() {
    const classes = useStyles()
    return (
        <AppBar position="static" className={classes.appBar}>
            <Toolbar className={classes.toolBar}>
                <SearchInput />
            </Toolbar>
        </AppBar>
    )
}

function SearchInput() {
    const classes = useStyles()
    const [_, setQueryData] = useQueryData()
    const history = useHistory()
    const { isExact } = useRouteMatch()
    const handleOnSearchClick = async () => {
        const searchValue = document.querySelector('#search').value

        if(!searchValue || searchValue.length === 0) {
            console.log("stoped");
            return;
        }
        const videos = await fetchVideos(searchValue)
        setQueryData(videos)

        if(!isExact) {
            history.push("/")
        }
    }
    return (
        <Paper component="div" className={classes.paperWrapper}>
            <InputBase
                className={classes.input}
                id="search"
                placeholder="Try to give a search"
                inputProps={{ 'aria-label': 'Try to give a search' }}
            />
            <IconButton
                type="submit"
                className={classes.iconButton}
                aria-label="search"
                onClick={handleOnSearchClick}
            >
                <SearchIcon />
            </IconButton>
        </Paper>
    )
}
