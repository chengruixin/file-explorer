import { useEffect, useState } from "react";
import "./Movies.css";

function Movies({ queryData }) {
  const [palyURL, setPlayURL] = useState(null);

  useEffect(() => {
    console.log(palyURL);
  }, [palyURL]);
  return (
    <>
      <VideoDisplay
        palyURL={palyURL}
        setPlayURL={setPlayURL}
        className={palyURL ? "show-flex" : "hide"}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ul
          style={{
            display: "block",
          }}
        >
          {queryData.map((item, key) => {
            return (
              <MoviePreview
                information={item}
                key={key}
                setPlayURL={setPlayURL}
              />
            );
          })}
        </ul>
      </div>
    </>
  );
}

function MoviePreview({ information, setPlayURL }) {
  const { fileName, handledFile, fileSize } = information;
  const requestURL = `http://localhost:8080/videos?location=${handledFile}`;
  return (
    <li
      style={{
        listStyle: "none",
        marginTop: "1em",
        display: "flex",
        alignItems: "center",
      }}
    >
      <h4>
        {fileName} <span>{fileSize}</span>
      </h4>

      <button
        style={{
          margin: "0.5rem",
          padding: "0.5rem 1rem",
        }}
        onClick={() => {
          setPlayURL(requestURL);
        }}
      >
        Click
      </button>
    </li>
  );
}

function VideoDisplay({ palyURL, setPlayURL, className }) {
  console.log(className);
  const handleClose = () => {
    const video = document.querySelector("#video-overlay video");
    console.log(video);
    video.pause();
    video.currentTime = 0;
    setPlayURL(null);
  };

  useEffect(() => {
    console.log("loaded");

    return () => {
      console.log("unloaded");
    };
  });
  return (
    <div
      className={className}
      id="video-overlay"
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(120,120,120, 0.3)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          width: "85%",
        }}
      >
        <header>
          <button onClick={handleClose}>Close</button>
        </header>

        <main>
          <video
            style={{
              width: "100%",
            }}
            controls="true"
            playsinline
            type="video/mp4"
            src={palyURL}
          ></video>
        </main>

        <footer>43 : {palyURL}</footer>
      </div>
    </div>
  );
}
export default Movies;
