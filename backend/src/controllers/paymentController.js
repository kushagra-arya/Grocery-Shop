const prisma = require('../config/database');
const { success, badRequest } = require('../utils/response');

/**
 * Process payment (Dummy Gateway)
 * POST /api/payments/process
 */
const processPayment = async (req, res, next) => {
  try {
    const { orderId, cardNumber, expiryDate, cvv, cardHolder } = req.body;

    // Verify order exists and belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.user.id,
      },
      include: { payment: true },
    });

    if (!order) {
      return badRequest(res, 'Order not found');
    }

    if (!order.payment) {
      return badRequest(res, 'Payment record not found');
    }

    if (order.payment.status === 'COMPLETED') {
      return badRequest(res, 'Payment already completed');
    }

    // Dummy payment validation
    // In real implementation, integrate with Stripe/Razorpay/PayPal

    // Simulate payment processing (always succeeds for demo)
    const isPaymentSuccessful = simulatePayment(cardNumber);

    if (!isPaymentSuccessful) {
      // Update payment status to failed
      await prisma.payment.update({
        where: { id: order.payment.id },
        data: { status: 'FAILED' },
      });

      return badRequest(res, 'Payment failed. Please try again.');
    }

    // Generate dummy transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Update payment and order status
    const [payment] = await prisma.$transaction([
      prisma.payment.update({
        where: { id: order.payment.id },
        data: {
          status: 'COMPLETED',
          transactionId,
          paidAt: new Date(),
        },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
      }),
    ]);

    return success(res, {
      transactionId,
      amount: parseFloat(order.totalAmount),
      status: 'COMPLETED',
      message: 'Payment successful',
    }, 'Payment processed successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Get payment details
 * GET /api/payments/:orderId
 */
const getPaymentDetails = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const where = { orderId };
    
    // Non-admin users can only see their own payments
    if (req.user.role !== 'ADMIN') {
      const order = await prisma.order.findFirst({
        where: { id: orderId, userId: req.user.id },
      });

      if (!order) {
        return badRequest(res, 'Order not found');
      }
    }

    const payment = await prisma.payment.findUnique({
      where: { orderId },
      include: {
        order: {
          select: { orderNumber: true, totalAmount: true },
        },
      },
    });

    if (!payment) {
      return badRequest(res, 'Payment not found');
    }

    return success(res, {
      ...payment,
      amount: parseFloat(payment.amount),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Simulate payment processing (Dummy)
 * Returns true for successful payment
 */
function simulatePayment(cardNumber) {
  // For testing: cards ending in 0000 will fail
  if (cardNumber && cardNumber.endsWith('0000')) {
    return false;
  }
  
  // Simulate 95% success rate
  return Math.random() > 0.05;
}

/**
 * Initiate refund (Admin)
 * POST /api/payments/:orderId/refund
 */
const initiateRefund = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { orderId },
      include: { order: true },
    });

    if (!payment) {
      return badRequest(res, 'Payment not found');
    }

    if (payment.status !== 'COMPLETED') {
      return badRequest(res, 'Cannot refund a payment that is not completed');
    }

    // Process refund (dummy)
    const refundTransactionId = `REF_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    await prisma.payment.update({
      where: { orderId },
      data: {
        status: 'REFUNDED',
        transactionId: refundTransactionId,
      },
    });

    return success(res, {
      refundTransactionId,
      amount: parseFloat(payment.amount),
      status: 'REFUNDED',
    }, 'Refund processed successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  processPayment,
  getPaymentDetails,
  initiateRefund,
};
