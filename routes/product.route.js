import express from 'express';
import { protect } from '../middleware/protect.js';
import { isAdmin } from '../middleware/isAdmin.js'
import { createProduct, getProducts, getProductBySlug, getProductById, updateProduct, searchProductSuggestions, searchProducts} from '../controllers/product.controller.js';

const router = express.Router();

router.get("/search", searchProducts); // For full results page
router.get("/search/suggestions", searchProductSuggestions); // For dropdown

router.get('/', getProducts);

router.get("/slug/:slug", getProductBySlug);

router.post('/', protect, isAdmin, createProduct);

router.get("/:id", getProductById);

router.put("/:id", protect, isAdmin, updateProduct);







export default router;
