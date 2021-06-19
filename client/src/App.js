import { useEffect } from 'react';
import './App.css';

function App() {

    useEffect(()=>{
        fetch("/query?searchPattern=jul")
            .then( res => {
                console.log(res);
                return res.text()
            })
            .then( data => {
                console.log(data);
            })
    },[])
    return (
        <div>
            hello
        </div>
    )
}

export default App;
