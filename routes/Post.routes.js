import { Router } from 'express';
import multer from 'multer';

import {
	checkAuth,
	checkAuthWithAccess,
	handleValidationErrors,
} from '../middlewares/index.js';
import {
	commentCreateValidation,
	pageAndLimitValidation,
	postCreateValidation,
} from '../validations.js';

import * as PostController from './../controllers/Post.controller.js';
import * as PostCommentController from './../controllers/PostComment.controller.js';

const router = Router();
const upload = multer({ dest: '/tmp/' });

// Posts
router.get(
	'/',
	checkAuthWithAccess,
	pageAndLimitValidation,
	handleValidationErrors,
	PostController.getPosts
);

router.get('/:id', checkAuthWithAccess, PostController.getOne);
router.post(
	'/',
	checkAuth,
	upload.single('image'),
	postCreateValidation,
	handleValidationErrors,
	PostController.create
);
router.delete('/:id', checkAuth, PostController.remove);
router.patch(
	'/:id',
	checkAuth,
	upload.single('image'),
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
	'/:id/comments',
	checkAuthWithAccess,
	pageAndLimitValidation,
	handleValidationErrors,
	PostCommentController.getAll
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
