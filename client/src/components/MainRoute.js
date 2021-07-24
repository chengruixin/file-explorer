import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Videos from './Videos'
import PlayVideo from './PlayVideo'

function MainRoute() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Videos} />
                {/* <Route path="/video" component={PlayVideo}/> */}
            </Switch>
        </Router>
    )
}

export default MainRoute
