import { Route, Switch, useRouteMatch } from 'react-router-dom'
import VideosView from './VideosView'
import VideoDisplay from './VideoDisplay'

function VideosRoute() {
    const { path } = useRouteMatch()

    return (
        <Switch>
            <Route exact path={`${path}/`} render={() => <VideosView />} />

            <Route path={`${path}/:id`}>
                <VideoDisplay />
            </Route>
        </Switch>
    )
}

export default VideosRoute
