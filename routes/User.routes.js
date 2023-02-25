import { Router } from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import handleValidationErrors from '../middlewares/handleValidationErrors.js';
import { pageAndLimitValidation, registerValidation } from '../validations.js';
import * as UserController from './../controllers/User.controller.js';

const router = Router();

router.get(
	'/',
	checkAuth,
	pageAndLimitValidation,
	handleValidationErrors,
	UserController.getAll
);
router.get('/:username', UserController.getOne);
router.post(
	'/changeProfile',
	registerValidation,
	checkAuth,
	UserController.changeProfile
);

export default router;
