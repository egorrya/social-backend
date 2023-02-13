import { body, check } from 'express-validator';

export const loginValidation = [
  body('email', 'Not valid email format').isEmail(),
  body('password', 'Password must be at least 6 characters').isLength({
    min: 6,
  }),
];

export const registerValidation = [
  body('email', 'Not valid email format').isEmail(),
  body('password', 'Password must be at least 6 characters').isLength({
    min: 6,
  }),
  body('username', 'Username must be at least 2 characters').isLength({
    min: 2,
  }),
  check('fullName', 'Your name must be at least 2 characters')
    .optional({ checkFalsy: true })
    .isLength({ min: 6 }),
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
  body('text', 'Text must be at least 1 to 140 characters')
    .isLength({ min: 1, max: 140 })
    .isString(),
];

export const pageAndLimitValidation = [
  body('limit', 'Limit must be at least 1').optional().isInt({ min: 1 }),
  body('page', 'Page must be at least 1').optional().isInt({ min: 1 }),
];
