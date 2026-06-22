const express = require('express');
const router = express.Router();
const controller = require('../controllers/watchlist.controller');
const validators = require('../validators/watchlist.validator');
const validate = require('../middleware/validate.middleware');

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', validators.createItem, validate, controller.create);
router.patch('/:id', validators.updateItem, validate, controller.update);
router.patch('/:id/rate', validators.rateItem, validate, controller.rate);
router.delete('/:id', controller.remove);

module.exports = router;