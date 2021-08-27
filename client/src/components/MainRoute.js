import { Route, Switch } from 'react-router-dom'
import Videos from './Videos'
import VideoDisplay from './VideoDisplay'
import { makeStyles } from '@material-ui/core/styles'
import { colors } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    // root: {
    //     backgroundColor: colors.,
    // },
}))

function MainRoute() {
    const classes = useStyles()
    return (
        <main className={classes.root}>
            <Switch>
                <Route exact path="/" component={Videos} />
                <Route path="/video" component={VideoDisplay} />
            </Switch>
        </main>
    )
}

export default MainRoute
