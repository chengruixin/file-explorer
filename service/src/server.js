const express = require("express");
const app = express();
const port = 8080;

// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild");
//     res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     next();
// })

app.get('/query', (req, res) => {
    console.log(req.query);
    console.log("requested");
    res.send("hello");
})

app.listen(port, () => {
    console.log("Listening on port " + port);
})