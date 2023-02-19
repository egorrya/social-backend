import { Router } from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import checkAuthWithAccess from '../middlewares/checkAuthWithAccess.js';
import handleValidationErrors from '../middlewares/handleValidationErrors.js';
import { pageAndLimitValidation } from '../validations.js';
import * as FollowController from './../controllers/Follow.controller.js';

const router = Router();

router.post('/', checkAuth, FollowController.toggleFollow);
router.get(
	'/',
	checkAuthWithAccess,
	pageAndLimitValidation,
	handleValidationErrors,
	FollowController.getFollowList
);

export default router;
