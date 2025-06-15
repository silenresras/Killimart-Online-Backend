import express from 'express'
import { signUp, login, logout, verifyEmail, forgotPassword, resetPassword, checkAuth, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();

router.get('/check-auth', checkAuth)
    
router.post('/signup', signUp)

router.post('/verify-email', verifyEmail)

router.get('/me',protect, getMe)

router.post('/login', login)

router.post('/forgot-password', forgotPassword)

router.post('/reset-password/:token', resetPassword)

router.post('/logout', logout)

export default router