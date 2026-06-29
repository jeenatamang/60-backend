const express = require('express');
const router = express.Router();
const controller = require('../controllers/expense.controller');
const validators = require('../validators/expense.validator');
const validate = require('../middleware/validate.middleware');

router.get('/summary', controller.summary);
router.get('/export', controller.exportCSV);
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', validators.createExpense, validate, controller.create);
router.patch('/:id', validators.updateExpense, validate, controller.update);
router.delete('/:id', controller.remove);

module.exports = router;