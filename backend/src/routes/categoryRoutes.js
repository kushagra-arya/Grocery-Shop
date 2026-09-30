const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { auth } = require('../middlewares/auth');
const { admin } = require('../middlewares/admin');
const { uploadSingle, handleUploadError } = require('../middlewares/upload');

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);

// Admin routes
router.post('/', auth, admin, uploadSingle, handleUploadError, categoryController.createCategory);
router.put('/:id', auth, admin, uploadSingle, handleUploadError, categoryController.updateCategory);
router.delete('/:id', auth, admin, categoryController.deleteCategory);

module.exports = router;
