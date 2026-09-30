const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { auth, optionalAuth } = require('../middlewares/auth');
const { admin } = require('../middlewares/admin');
const { validate } = require('../middlewares/validate');
const { uploadMultiple, handleUploadError } = require('../middlewares/upload');
const {
  createProductValidator,
  updateProductValidator,
  productIdValidator,
} = require('../validators/productValidator');

// Public routes
router.get('/', optionalAuth, productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:id', optionalAuth, productController.getProduct);

// Admin routes - multer must run BEFORE validators so req.body is populated from multipart
router.post('/', auth, admin, uploadMultiple, handleUploadError, createProductValidator, validate, productController.createProduct);
router.put('/:id', auth, admin, uploadMultiple, handleUploadError, updateProductValidator, validate, productController.updateProduct);
router.delete('/:id', auth, admin, productIdValidator, validate, productController.deleteProduct);

module.exports = router;
