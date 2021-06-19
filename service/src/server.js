const express = require("express");
const app = express();
const port = 8080;
const searchFiles = require("./common/searchFilesAsync");
const directoriesToBeExplored = require("./data/dirsTobeExplored");
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild");
//     res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     next();
// })

app.get('/query', (req, res) => {
    const { search } = req.query;
    
    if(!search){
        res.json([]);
        console.log("return")
        return;
    }
    
    console.time("Processing Time")
    searchFiles(directoriesToBeExplored, search.split(" "))
        .then( data => {
            console.log(data.length);
            console.timeEnd("Processing Time")
            res.json(data);
        })
})

app.listen(port, () => {
    console.log("Listening on port " + port);
})