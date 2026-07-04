import express from 'express';
import * as controller from '../controllers/watchlist.controller.js';
import * as validators from '../validators/watchlist.validator.js';
import validate from '../middleware/validate.middleware.js';

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', validators.createItem, validate, controller.create);
router.patch('/:id', validators.updateItem, validate, controller.update);
router.patch('/:id/rate', validators.rateItem, validate, controller.rate);
router.delete('/:id', controller.remove);

export default router;
