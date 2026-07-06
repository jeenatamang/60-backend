import express from 'express';
import * as controller from '../controllers/brand.controller.js';

const router = express.Router();

router.get('/stats', controller.stats);
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
