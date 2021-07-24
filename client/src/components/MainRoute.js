import { Route, Switch } from 'react-router-dom'
import Videos from './Videos'
import VideoDisplay from './VideoDisplay'

function MainRoute() {
    return (
        <Switch>
            <Route exact path="/" component={Videos} />
            <Route path="/video" component={VideoDisplay} />
        </Switch>
    )
}

export default MainRoute
