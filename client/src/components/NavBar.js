import React, { useEffect, useState } from 'react'
import ReactDom from 'react-dom'
import {
    Paper,
    InputBase,
    IconButton,
    AppBar,
    Toolbar,
    colors,
    CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import { useQueryData } from '../context'
import { fetchVideos } from '../services'
import { useHistory, useRouteMatch } from 'react-router'

const useStyles = makeStyles((theme) => ({
    appBar: {
        backgroundColor: colors.lightBlue[600],
        // height: 70
    },
    paperWrapper: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
        height: 30,
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
    const [isSearching, setIsSearching] = useState(false)

    const [debug, setDebug] = useState(null);

    const handleOnSearchClick = async () => {
        try {
            if (isSearching) {
                return
            }
            console.log('triggered')
            setIsSearching(true)
            const searchValue = document.querySelector('#search').value

            if (!searchValue || searchValue.length === 0) {
                console.log('stoped')
                return
            }
            const { data } = await fetchVideos(searchValue)

            setQueryData(data)

            if (!isExact) {
                history.push('/')
            }
            setIsSearching(false)
        } catch (err) {
            setIsSearching(false)
            setDebug(JSON.stringify(err));
            console.log(err)
        }
    }

    if(debug) {
        return ReactDom.createPortal(<div>{debug}</div>, document.querySelector("#debug"));
    }
    return (
        <Paper component="div" className={classes.paperWrapper}>
            <InputBase
                className={classes.input}
                id="search"
                placeholder="Try to give a search"
                inputProps={{ 'aria-label': 'Try to give a search' }}
                onKeyPressCapture={(e) => {
                    if (e.code === 'Enter') {
                        handleOnSearchClick()
                    }
                }}
            />

            <IconButton
                type="submit"
                className={classes.iconButton}
                aria-label="search"
                onClick={handleOnSearchClick}
                disabled={isSearching}
            >
                {isSearching ? (
                    <CircularProgress size={18} />
                ) : (
                    <SearchIcon style={{ fontSize: 18 }} />
                )}
                {/* <SearchIcon />
                <CircularProgress size={20} /> */}
            </IconButton>
        </Paper>
    )
}
