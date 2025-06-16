import express from 'express'
import { signUp, login, logout, verifyEmail, forgotPassword, resetPassword, checkAuth, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/protect.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

router.get('/check-auth', protect, checkAuth, isAdmin)
    
router.post('/signup', signUp)

router.post('/verify-email', verifyEmail)

router.get('/me',protect, getMe)

router.post('/login', login)

router.post('/forgot-password', forgotPassword)

router.post('/reset-password/:token', resetPassword)


//signup
router.post('/signup', signUp)

//verifyEmail
router.post('/verify-email', verifyEmail)

//login
router.post('/login', login)

router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)

//logout
router.post('/logout', logout)

export default router