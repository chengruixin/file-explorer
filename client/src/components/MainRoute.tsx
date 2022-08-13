import { Route, Switch, Redirect } from 'react-router-dom'
import VideosRoute from './Videos/VideosRoute'

function MainRoute() {
    return (
        <Switch>
            <Route exact path="/">
                <Redirect to="/videos"></Redirect>
            </Route>

            <Route path="/videos" component={VideosRoute}></Route>
        </Switch>
    )
}

export default MainRoute
