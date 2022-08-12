import express from 'express';
import videosRouter from './routes/videos';

const app = express();

app.use('/api/videos', videosRouter);

export default app;
