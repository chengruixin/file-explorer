import fs from 'fs';
import path from 'path';
import https from 'https';
import app from './app';

const HTTP_PORT = 8080;
const HTTPS_PORT = 8443;
const OPTIONS = {
    key: fs.readFileSync(path.join(__dirname, '../.certs/server.key')),
    cert: fs.readFileSync(path.join(__dirname, '../.certs/server.cert')),
};

app.listen(HTTP_PORT, () => {
    console.log(`HTTP open on port ${HTTP_PORT}`)
});

https.createServer(OPTIONS, app).listen(HTTPS_PORT, () => {
    console.log(`HTTPS on port ${HTTPS_PORT}`)
});
