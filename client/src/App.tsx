import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from './components/Navbar';
import Routes from './routes';
import './App.css';
import React from 'react';
import { configure } from 'mobx';
console.log(React.version);

configure({
  enforceActions: 'never'
})
function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes />
      </Router>
    </>
  );
}

export default App;
