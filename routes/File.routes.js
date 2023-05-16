import { Router } from 'express';
import multer from 'multer';

import { deleteFile, uploadFile } from '../controllers/File.controller.js';

const router = Router();
const upload = multer({ dest: '/tmp/' });

router.post('/', upload.single('file'), uploadFile);
router.delete('/:publicId', deleteFile);

export default router;
