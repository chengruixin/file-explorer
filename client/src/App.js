import { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';
import Movies from './components/Movies';
import './App.css';

function App() {

    const [queryData,  setQueryData] = useState([]);

    const setSearchQuery = (val) => {
        fetch("/query?search=" + val)
            .then(res => res.json())
            .then( data => {
                // console.log(data);
                setQueryData(data);
            })
    }

    
    return (
        <div>
            <SearchBar setSearchQuery={setSearchQuery}/>
            <Movies queryData={queryData}/>
        </div>
    )
}

export default App;
