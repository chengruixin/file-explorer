import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import NavBar from './components/Navbar'
import MainRoute from './components/MainRoute'
import IndexContext from './context'
import './App.css'

function App() {
    const [queryData, setQueryData] = useState([])
    const setSearchQuery = (val) => {
        fetch('/query?search=' + val)
            .then((res) => res.json())
            .then((data) => {
                // console.log(data);
                setQueryData(data)
            })
    }

    return (
        <IndexContext>
            {/* <img src="https://localhost:8443/image"></img> */}
            <Router>
                <NavBar setSearchQuery={setSearchQuery} />
                <MainRoute />
            </Router>
        </IndexContext>
    )
}

export default App
