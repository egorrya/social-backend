import { Router } from 'express';
import checkAuth from '../utils/checkAuth.js';
import handleValidationErrors from '../utils/handleValidationErrors.js';
import { pageAndLimitValidation } from '../validations.js';
import * as UserController from './../controllers/User.controller.js';

const router = Router();

router.get(
  '/',
  checkAuth,
  pageAndLimitValidation,
  handleValidationErrors,
  UserController.getAll
);
router.get('/:id', checkAuth, UserController.getOne);

export default router;
