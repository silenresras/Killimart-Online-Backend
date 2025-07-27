import express from 'express';
import { chatHandler } from '../controllers/chat.controller.js';

const router = express.Router();

router.post('/chat', chatHandler);

export default router;
