import express from 'express';
import { getAll, getOne, create, remove } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);
router.delete('/:id', remove);

export default router;
