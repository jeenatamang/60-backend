import express from 'express';
import {
  getAll,
  getOne,
  getTopRated,
  getWatchQueue,
  getByDirector,
  create,
  update,
  markWatched,
  addReview,
  stats,
  remove
} from '../controllers/movie.controller.js';

const router = express.Router();

router.get('/stats', stats);
router.get('/top-rated', getTopRated);
router.get('/watch-queue', getWatchQueue);
router.get('/director/:director', getByDirector);
router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);
router.patch('/:id', update);
router.patch('/:id/watched', markWatched);
router.patch('/:id/review', addReview);
router.delete('/:id', remove);

export default router;
