import { useState } from 'react';
import './SearchBar.css';

function SearchBar({setSearchQuery}){
   

    const handleChangeEvent = (e) => {
        // console.log(e.target.value);
    }

    const handleClickEvent = (e) => {
        const inputValue = document.querySelector("#search-bar").value;
        setSearchQuery(inputValue);
    }
    return (
        <div className="search-box">
            <input className="search-bar" type="text" id="search-bar" onChange={handleChangeEvent} />
            <button onClick={handleClickEvent}>Search</button>
        </div>
        
        
    )
}

export default SearchBar;