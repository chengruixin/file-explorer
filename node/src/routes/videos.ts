import express from 'express';
import videosController from '../controllers/videosController';
// base url /videos
const videosRouter = express();

videosRouter.get('/', videosController.getVideos)

videosRouter.get('/:id', videosController.getVideoByID);

videosRouter.post('/refresh', videosController.updateVideosSoft);

// videosRouter.get('/favorites', );

// videosRouter.post('/favorites', );

export default videosRouter;