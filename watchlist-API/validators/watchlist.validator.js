const { body } = require('express-validator');
exports.createItem = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),

  body('type')
    .notEmpty()
    .withMessage('Type is required')
    .isIn(['movie', 'anime', 'series'])
    .withMessage('Type must be one of: movie, anime, series'),
];

exports.updateItem = [
  body('status')
    .optional()
    .isIn(['plan_to_watch', 'watching', 'completed'])
    .withMessage('Status must be one of: plan_to_watch, watching, completed'),

  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Title must be under 100 characters'),
];

exports.rateItem = [
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isFloat({ min: 1, max: 10 })
    .withMessage('Rating must be a number between 1 and 10'),
];