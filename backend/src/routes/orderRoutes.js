const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth } = require('../middlewares/auth');
const { admin } = require('../middlewares/admin');
const { validate } = require('../middlewares/validate');
const {
  createOrderValidator,
  updateOrderStatusValidator,
  orderIdValidator,
} = require('../validators/orderValidator');

// All order routes require authentication
router.use(auth);

// Customer routes
router.get('/', orderController.getOrders);
router.get('/number/:orderNumber', orderController.getOrderByNumber);
router.get('/:id', orderIdValidator, validate, orderController.getOrder);
router.post('/', createOrderValidator, validate, orderController.createOrder);
router.post('/:id/initiate-payment', orderIdValidator, validate, orderController.initiatePayment);
router.post('/:id/verify-payment', orderIdValidator, validate, orderController.verifyPayment);
router.put('/:id/cancel', orderIdValidator, validate, orderController.cancelOrder);

// Admin routes
router.get('/admin/all', admin, orderController.getAllOrders);
router.put('/:id/status', admin, updateOrderStatusValidator, validate, orderController.updateOrderStatus);

module.exports = router;
