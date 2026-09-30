const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { auth } = require('../middlewares/auth');
const { admin } = require('../middlewares/admin');

// Public routes
router.get('/product/:productId', reviewController.getProductReviews);

// Protected routes
router.post('/', auth, reviewController.createReview);
router.get('/my-reviews', auth, reviewController.getMyReviews);
router.get('/can-review/:productId', auth, reviewController.canReviewProduct);
router.put('/:id', auth, reviewController.updateReview);
router.delete('/:id', auth, reviewController.deleteReview);
router.post('/:id/helpful', auth, reviewController.markHelpful);

// Admin routes
router.get('/admin/all', auth, admin, reviewController.getAllReviews);
router.put('/:id/visibility', auth, admin, reviewController.toggleVisibility);

module.exports = router;
