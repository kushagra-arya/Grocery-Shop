const { body, param } = require('express-validator');

const createOrderValidator = [
  body('addressId')
    .notEmpty()
    .withMessage('Delivery address is required')
    .isUUID()
    .withMessage('Invalid address ID'),
  body('paymentMethod')
    .notEmpty()
    .withMessage('Payment method is required')
    .isIn(['CARD', 'UPI', 'COD', 'WALLET', 'NETBANKING'])
    .withMessage('Invalid payment method'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must be at most 500 characters'),
];

const updateOrderStatusValidator = [
  param('id')
    .isUUID()
    .withMessage('Invalid order ID'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
    .withMessage('Invalid order status'),
];

const orderIdValidator = [
  param('id')
    .isUUID()
    .withMessage('Invalid order ID'),
];

module.exports = {
  createOrderValidator,
  updateOrderStatusValidator,
  orderIdValidator,
};
