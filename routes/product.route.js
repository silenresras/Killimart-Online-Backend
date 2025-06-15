import express from 'express';
import { protect } from '../middleware/protect.js';
import { isAdmin } from '../middleware/isAdmin.js'
import { createProduct, getProducts, getProductBySlug } from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', getProducts);

router.get("/slug/:slug", getProductBySlug);

router.post('/', protect, isAdmin, createProduct);

export default router;
