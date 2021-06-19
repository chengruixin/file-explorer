import './Movies.css';

function Movies({queryData}){
    return (
        <div style={{
            display : "flex",
            justifyContent : "center"
        }}>
            <ul style={{
                display : "block"
            }}>
                {queryData.map((item, key) => {
                    return <MoviePreview information={item} key={key}/>
                    
                })}
            </ul>
        </div>
        
    )
}

function MoviePreview({information}){
    const {fileName, handledFile, fileSize} = information;

    return (
        <li style={{
           listStyle : "none",
           marginTop : "1em"
        }}>
            <h4>{fileName} <span>{fileSize}</span></h4>
            {/* <div>{handledFile}</div> */}
            <a href={handledFile}>{handledFile}</a>
           
        </li>
    )
}

export default Movies;