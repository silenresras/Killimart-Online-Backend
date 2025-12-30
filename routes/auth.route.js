import express from 'express';
<<<<<<< HEAD
import { signUp, login, logout, forgotPassword, resetPassword, checkAuth, getMe, addShippingAddress,
=======
import { signUp, login, logout, verifyEmail, forgotPassword, resetPassword, checkAuth, getMe, addShippingAddress,
>>>>>>> origin/main
    deleteShippingAddress, editShippingAddress,
    getShippingAddresses, getDefaultShippingAddress} from '../controllers/auth.controller.js';
import { protect } from '../middleware/protect.js';

const router = express.Router()
// Auth
router.post('/signup', signUp)
<<<<<<< HEAD
=======
router.post('/verify-email', verifyEmail)
>>>>>>> origin/main
router.post('/login', login)
router.post('/logout', logout)
router.get('/check-auth', protect, checkAuth)
router.get('/me', protect, getMe)

// Password
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)

// Shipping
router.post("/shipping-address", protect, addShippingAddress)
router.delete("/shipping-address/:addressId", protect, deleteShippingAddress)
router.put("/shipping-address/:addressId", protect, editShippingAddress)
router.get("/shipping-address", protect, getShippingAddresses)
router.get("/shipping-address/default", protect, getDefaultShippingAddress)

export default router