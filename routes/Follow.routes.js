import { Router } from 'express';
import checkAuth from '../utils/checkAuth.js';
import handleValidationErrors from '../utils/handleValidationErrors.js';
import { pageAndLimitValidation } from '../validations.js';
import * as FollowController from './../controllers/Follow.controller.js';

const router = Router();

router.post('/', checkAuth, FollowController.toggleFollow);
router.get(
  '/followers',
  checkAuth,
  pageAndLimitValidation,
  handleValidationErrors,
  FollowController.getFollowersList
);
router.get(
  '/following',
  checkAuth,
  pageAndLimitValidation,
  handleValidationErrors,
  FollowController.getFollowingList
);

export default router;
