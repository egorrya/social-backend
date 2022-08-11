import { Router } from 'express';
import { checkAuth, handleValidationErrors } from '../utils/index.js';
import {
  commentCreateValidation,
  pageAndLimitValidation,
  postCreateValidation,
} from '../validations.js';

import * as PostController from './../controllers/Post.controller.js';
import * as PostCommentController from './../controllers/PostComment.controller.js';

const router = Router();

// Posts
router.get(
  '/',
  pageAndLimitValidation,
  handleValidationErrors,
  PostController.all
);
router.get(
  '/feed',
  checkAuth,
  pageAndLimitValidation,
  handleValidationErrors,
  PostController.feed
);
router.get('/:id', PostController.one);
router.post(
  '/',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
router.delete('/:id', checkAuth, PostController.remove);
router.patch(
  '/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

// Likes
router.post(
  '/:id/toggle-like',
  checkAuth,
  handleValidationErrors,
  PostController.toggleLike
);

// Comments
router.get(
  '/:id/comment',
  pageAndLimitValidation,
  handleValidationErrors,
  PostCommentController.all
);
router.post(
  '/:id/comment',
  checkAuth,
  commentCreateValidation,
  handleValidationErrors,
  PostCommentController.create
);
router.delete('/:id/comment', checkAuth, PostCommentController.remove);

export default router;
