import express from 'express';
import {
  getAll,
  getOne,
  getActive,
  getHighPriority,
  create,
  update,
  updateStatus,
  addNote,
  remove,
  stats,
  analytics
} from '../controllers/job.controller.js';

const router = express.Router();

router.get('/stats', stats);
router.get('/analytics', analytics);
router.get('/active', getActive);
router.get('/high-priority', getHighPriority);
router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);
router.patch('/:id', update);
router.patch('/:id/status', updateStatus);
router.patch('/:id/note', addNote);
router.delete('/:id', remove);

export default router;
