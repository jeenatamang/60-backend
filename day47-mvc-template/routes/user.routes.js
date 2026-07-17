import express from 'express';
import {
  getAll,
  getOne,
  create,
  update,
  deactivate,
  remove,
  stats
} from '../controllers/user.controller.js';
import { createUserRules, updateUserRules } from '../validators/user.validator.js';
import validate from '../middleware/validate.middleware.js';

const router = express.Router();

router.get('/stats', stats);
router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', createUserRules, validate, create);
router.patch('/:id', updateUserRules, validate, update);
router.patch('/:id/deactivate', deactivate);
router.delete('/:id', remove);

export default router;
