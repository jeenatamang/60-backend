import { body } from 'express-validator';

export const createUserRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 60 }).withMessage('Name must be between 2 and 60 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address'),

  body('role')
    .optional()
    .isIn(['user', 'admin']).withMessage('Role must be user or admin')
];

export const updateUserRules = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be empty')
    .isLength({ min: 2, max: 60 }).withMessage('Name must be between 2 and 60 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Must be a valid email address'),

  body('role')
    .optional()
    .isIn(['user', 'admin']).withMessage('Role must be user or admin')
];
