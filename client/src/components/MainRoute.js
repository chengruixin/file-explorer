import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Movies from './Movies'
import PlayVideo from './PlayVideo'

function MainRoute() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Movies} />
                <Route path="/video" component={PlayVideo}/>
            </Switch>
        </Router>
    )
}

export default MainRoute
