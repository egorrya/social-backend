import { body, check } from 'express-validator';
import UserModel from './models/User.model.js';

export const loginValidation = [
  body('email', 'Not valid email format').isEmail(),
  body('password', 'Password must be at least 6 characters').isLength({
    min: 5,
  }),
];

export const registerValidation = [
  body('email', 'Not valid email format').isEmail(),
  body('password', 'Password must be at least 6 characters').isLength({
    min: 5,
  }),
  body('fullName', 'Your name must be at least 1 character').isLength({
    min: 1,
  }),
  body('avatarUrl', 'Not valid avatar url').optional().isURL(),
  body('backgroundUrl', 'Not valid background url').optional().isURL(),
];

export const postCreateValidation = [
  body('text', 'Text must be at least 1 to 140 characters')
    .isLength({ min: 1, max: 140 })
    .isString(),
  body('imageUrl', 'Not valid image url').optional().isString(),
];

export const commentCreateValidation = [
  body('comment', 'Text must be at least 1 to 140 characters')
    .isLength({ min: 1, max: 140 })
    .isString(),
];

export const pageAndLimitValidation = [
  body('limit', 'Limit must be at least 1').optional().isInt({ min: 1 }),
  body('page', 'Page must be at least 1').optional().isInt({ min: 1 }),
];
