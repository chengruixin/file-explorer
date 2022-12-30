import { Route, Switch, Redirect } from 'react-router-dom';
import VideoDisplay from '../components/Videos/VideoDisplay';
import VideosView from '../components/Videos/VideosView';

function NoRoute() {
  return (
    <div>no route matched</div>
  )
}
function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to="/videos"></Redirect>
      </Route>

      <Route exact path="/videos" component={VideosView} />
      <Route exact path={"/videos/:id"} component={VideoDisplay} />

      <Route path={"*"} component={NoRoute} />
    </Switch>
  );
}

export default Routes;