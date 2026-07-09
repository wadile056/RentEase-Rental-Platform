const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct 
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public browse routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Controlled administrative endpoints
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);

module.exports = router;