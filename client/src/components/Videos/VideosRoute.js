import { Route, Switch, useRouteMatch } from 'react-router-dom'
import Videos from './index'
import VideoDisplay from './VideoDisplay/index.js'

function VideosRoute() {
    const { path } = useRouteMatch()

    return (
        <Switch>
            <Route exact path={`${path}/`} render={() => <Videos />} />

            <Route path={`${path}/:id`}>
                <VideoDisplay />
            </Route>
        </Switch>
    )
}

export default VideosRoute
