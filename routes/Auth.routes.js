import { Router } from 'express';
import { checkAuth, handleValidationErrors } from '../middlewares/index.js';
import { loginValidation, registerValidation } from '../validations.js';

import * as UserController from '../controllers/User.controller.js';

const router = Router();

router.post(
  '/login',
  loginValidation,
  handleValidationErrors,
  UserController.login
);
router.post(
  '/register',
  registerValidation,
  handleValidationErrors,
  UserController.register
);
router.get('/me', checkAuth, UserController.getMe);

export default router;
