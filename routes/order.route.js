import express from 'express';
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/order.controller.js';

import { protect } from '../middleware/protect.js';       // ✅ Auth middleware
import { isAdmin } from '../middleware/isAdmin.js';       // ✅ Admin role check

const router = express.Router();

// 🛒 User places an order
router.post('/', protect, placeOrder);

// 👤 User views their orders
router.get('/my-orders', protect, getMyOrders);

// 🛠 Admin views all orders
router.get('/admin/orders', protect, isAdmin, getAllOrders);

// 🛠 Admin updates order status (paid, shipped, etc.)
router.patch('/admin/orders/:id/status', protect, isAdmin, updateOrderStatus);

export default router;
