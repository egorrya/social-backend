import { Router } from 'express';
import { checkAuth, handleValidationErrors } from '../utils/index.js';
import {
  commentCreateValidation,
  postCreateValidation,
} from '../validations.js';

import * as PostController from './../controllers/Post.controller.js';
import * as PostCommentController from './../controllers/PostComment.controller.js';

const router = Router();

// Posts
router.get('/', PostController.getAll);
router.get('/:id', PostController.getOne);
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
router.get('/:id/comment', PostCommentController.getAll);
router.post(
  '/:id/comment',
  checkAuth,
  commentCreateValidation,
  handleValidationErrors,
  PostCommentController.create
);
router.delete('/:id/comment', checkAuth, PostCommentController.remove);

export default router;
