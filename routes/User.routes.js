import { Router } from 'express';
import checkAuth from '../utils/checkAuth.js';
import * as UserController from './../controllers/User.controller.js';

const router = Router();

router.get('/', checkAuth, UserController.getAll);
router.get('/:id', checkAuth, UserController.getOne);

export default router;
