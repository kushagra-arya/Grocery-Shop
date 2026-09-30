const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { auth } = require('../middlewares/auth');
const { admin } = require('../middlewares/admin');

// All payment routes require authentication
router.use(auth);

router.post('/process', paymentController.processPayment);
router.get('/:orderId', paymentController.getPaymentDetails);

// Admin routes
router.post('/:orderId/refund', admin, paymentController.initiateRefund);

module.exports = router;
