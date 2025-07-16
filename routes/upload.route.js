import express from 'express';
import { uploadImages, upload } from '../controllers/upload.controller.js';

const router = express.Router();

// Accept up to 5 images at once
router.post('/upload', upload.array('images', 5), uploadImages);


export default router;
