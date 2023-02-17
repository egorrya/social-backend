import { Router } from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import handleValidationErrors from '../middlewares/handleValidationErrors.js';
import { pageAndLimitValidation } from '../validations.js';
import * as FollowController from './../controllers/Follow.controller.js';

const router = Router();

router.post('/', checkAuth, FollowController.toggleFollow);
router.get(
	'/followers',
	pageAndLimitValidation,
	handleValidationErrors,
	FollowController.getFollowersList
);
router.get(
	'/following',
	pageAndLimitValidation,
	handleValidationErrors,
	FollowController.getFollowingList
);

export default router;
