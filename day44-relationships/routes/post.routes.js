import express from 'express';
import {
  getAll,
  getOne,
  create,
  update,
  publish,
  addComment,
  deleteComment,
  likePost,
  remove,
  stats
} from '../controllers/post.controller.js';

const router = express.Router();

router.get('/stats', stats);
router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);
router.patch('/:id', update);
router.patch('/:id/publish', publish);
router.patch('/:id/like', likePost);
router.post('/:id/comments', addComment);
router.delete('/:id/comments/:commentId', deleteComment);
router.delete('/:id', remove);

export default router;
