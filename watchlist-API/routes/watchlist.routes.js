import express from 'express';
import {
  getAll,
  getOne,
  create,
  update,
  rate,
  remove
} from '../controllers/watchlist.controller.js';

const router = express.Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);
router.patch('/:id', update);
router.patch('/:id/rate', rate);
router.delete('/:id', remove);

export default router;