// routes/training.routes.js
import express from 'express';
import { trainChatbot } from '../controllers/training.controller.js';
import { protect } from '../middleware/protect.js';
import { isAdmin } from '../middleware/isAdmin.js'

const router = express.Router();

router.post('/train', protect, isAdmin, trainChatbot); // Add admin auth middleware in production

export default router;
