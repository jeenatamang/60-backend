import { body } from 'express-validator';

const VALID_CATEGORIES = ['food', 'transport', 'entertainment', 'health', 'education', 'other'];

export const createExpense = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title must be under 100 characters'),

  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 1 })
    .withMessage('Amount must be a positive number'),

  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(VALID_CATEGORIES)
    .withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),

  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be a valid date (YYYY-MM-DD)'),

  body('note')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Note must be under 200 characters')
];

export const updateExpense = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Title must be under 100 characters'),

  body('amount')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Amount must be a positive number'),

  body('category')
    .optional()
    .isIn(VALID_CATEGORIES)
    .withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid date (YYYY-MM-DD)')
];
