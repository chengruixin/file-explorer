import { useEffect, useState } from 'react'
import NavBar from './components/NavBar'
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
            <NavBar setSearchQuery={setSearchQuery} />
            <main>
                <MainRoute />
            </main>
        </IndexContext>
    )
}

export default App
