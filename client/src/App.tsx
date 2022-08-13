import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from './components/Navbar';
import MainRoute from './components/MainRoute';
import IndexContext from './context';
import './App.css';

function App() {
  return (
    <IndexContext>
      <Router>
        <NavBar />
        <MainRoute />
      </Router>
    </IndexContext>
  );
}

export default App;
