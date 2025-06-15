import express from 'express';
import { uploadImage, upload } from '../controllers/upload.controller.js';

const router = express.Router();

router.post('/upload', upload.single('image'), uploadImage);

export default router;
