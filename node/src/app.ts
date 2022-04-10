import express from 'express';
import videosRouter from './routes/videos';

const app = express();

app.use('/videos', videosRouter);

export default app;
