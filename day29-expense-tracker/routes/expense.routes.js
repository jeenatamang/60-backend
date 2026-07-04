import express from 'express';
import * as controller from '../controllers/expense.controller.js';
import * as validators from '../validators/expense.validator.js';
import validate from '../middleware/validate.middleware.js';

const router = express.Router();

router.get('/summary', controller.summary);
router.get('/export', controller.exportCSV);
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', validators.createExpense, validate, controller.create);
router.patch('/:id', validators.updateExpense, validate, controller.update);
router.delete('/:id', controller.remove);

export default router;
