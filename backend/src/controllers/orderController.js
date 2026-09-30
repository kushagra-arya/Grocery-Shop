const prisma = require('../config/database');
const { success, created, badRequest, notFound, paginated } = require('../utils/response');
const { generateOrderNumber, getPagination, formatPaginationResponse } = require('../utils/helpers');
const { TAX_RATE, FREE_SHIPPING_THRESHOLD, SHIPPING_CHARGE } = require('../config/constants');

/**
 * Get user's orders
 * GET /api/orders
 */
const getOrders = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;
    const { skip, take, page: pageNum, limit: limitNum } = getPagination(page, limit);

    const where = { userId: req.user.id };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          orderItems: {
            include: {
              product: {
                include: {
                  images: {
                    where: { isPrimary: true },
                    take: 1,
                  },
                },
              },
            },
          },
          address: true,
          payment: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    // Format orders
    const formattedOrders = orders.map(order => ({
      ...order,
      subtotal: parseFloat(order.subtotal),
      tax: parseFloat(order.tax),
      shippingCharge: parseFloat(order.shippingCharge),
      discount: parseFloat(order.discount),
      totalAmount: parseFloat(order.totalAmount),
      orderItems: order.orderItems.map(item => ({
        ...item,
        unitPrice: parseFloat(item.unitPrice),
        total: parseFloat(item.total),
        productImage: item.product.images?.[0]?.imageUrl || null,
      })),
    }));

    const pagination = formatPaginationResponse(total, pageNum, limitNum);
    return paginated(res, formattedOrders, pagination);
  } catch (err) {
    next(err);
  }
};

/**
 * Get single order details
 * GET /api/orders/:id
 */
const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const where = { id };
    // Non-admin users can only see their own orders
    if (req.user.role !== 'ADMIN') {
      where.userId = req.user.id;
    }

    const order = await prisma.order.findFirst({
      where,
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true, phone: true },
        },
        address: true,
        orderItems: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
          },
        },
        payment: true,
      },
    });

    if (!order) {
      return notFound(res, 'Order not found');
    }

    // Format order
    const formattedOrder = {
      ...order,
      subtotal: parseFloat(order.subtotal),
      tax: parseFloat(order.tax),
      shippingCharge: parseFloat(order.shippingCharge),
      discount: parseFloat(order.discount),
      totalAmount: parseFloat(order.totalAmount),
      orderItems: order.orderItems.map(item => ({
        ...item,
        unitPrice: parseFloat(item.unitPrice),
        total: parseFloat(item.total),
        productImage: item.product.images?.[0]?.imageUrl || null,
      })),
    };

    return success(res, formattedOrder);
  } catch (err) {
    next(err);
  }
};

/**
 * Create new order from cart
 * POST /api/orders
 */
const createOrder = async (req, res, next) => {
  try {
    const { addressId, paymentMethod, notes } = req.body;

    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId: req.user.id },
    });

    if (!address) {
      return notFound(res, 'Address not found');
    }

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return badRequest(res, 'Cart is empty');
    }

    // Validate stock and calculate totals
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of cartItems) {
      if (!item.product.isActive) {
        return badRequest(res, `Product "${item.product.name}" is no longer available`);
      }

      if (item.quantity > item.product.stockQuantity) {
        return badRequest(res, `Insufficient stock for "${item.product.name}". Only ${item.product.stockQuantity} available.`);
      }

      const unitPrice = parseFloat(item.product.price);
      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        total: itemTotal,
      });
    }

    // Calculate charges
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const shippingCharge = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
    const totalAmount = Math.round((subtotal + tax + shippingCharge) * 100) / 100;

    // Create order with transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: req.user.id,
          addressId,
          subtotal,
          tax,
          shippingCharge,
          totalAmount,
          notes,
          orderItems: {
            create: orderItemsData,
          },
          payment: {
            create: {
              amount: totalAmount,
              method: paymentMethod,
              status: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
            },
          },
        },
        include: {
          orderItems: true,
          payment: true,
        },
      });

      // Update product stock and create inventory logs
      for (const item of cartItems) {
        const newStock = item.product.stockQuantity - item.quantity;

        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: newStock },
        });

        await tx.inventoryLog.create({
          data: {
            productId: item.productId,
            changeQty: -item.quantity,
            prevQty: item.product.stockQuantity,
            newQty: newStock,
            reason: 'SALE',
            notes: `Order ${newOrder.orderNumber}`,
          },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { userId: req.user.id },
      });

      return newOrder;
    });

    return created(res, order, 'Order placed successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Update order status (Admin)
 * PUT /api/orders/:id/status
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return notFound(res, 'Order not found');
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        payment: true,
      },
    });

    // If order is delivered and payment is COD, mark payment as completed
    if (status === 'DELIVERED' && updatedOrder.payment?.method === 'COD') {
      await prisma.payment.update({
        where: { orderId: id },
        data: {
          status: 'COMPLETED',
          paidAt: new Date(),
        },
      });
    }

    return success(res, updatedOrder, 'Order status updated');
  } catch (err) {
    next(err);
  }
};

/**
 * Cancel order
 * PUT /api/orders/:id/cancel
 */
const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const where = { id };
    if (req.user.role !== 'ADMIN') {
      where.userId = req.user.id;
    }

    const order = await prisma.order.findFirst({
      where,
      include: { orderItems: true },
    });

    if (!order) {
      return notFound(res, 'Order not found');
    }

    // Check if order can be cancelled
    if (['SHIPPED', 'DELIVERED', 'CANCELLED'].includes(order.status)) {
      return badRequest(res, `Cannot cancel order with status: ${order.status}`);
    }

    // Cancel order and restore stock
    await prisma.$transaction(async (tx) => {
      // Update order status
      await tx.order.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });

      // Update payment status
      await tx.payment.updateMany({
        where: { orderId: id },
        data: { status: 'REFUNDED' },
      });

      // Restore stock
      for (const item of order.orderItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        const newStock = product.stockQuantity + item.quantity;

        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: newStock },
        });

        await tx.inventoryLog.create({
          data: {
            productId: item.productId,
            changeQty: item.quantity,
            prevQty: product.stockQuantity,
            newQty: newStock,
            reason: 'RETURNED',
            notes: `Order ${order.orderNumber} cancelled`,
          },
        });
      }
    });

    return success(res, null, 'Order cancelled successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Get all orders (Admin)
 * GET /api/orders/admin/all
 */
const getAllOrders = async (req, res, next) => {
  try {
    const { page, limit, status, search } = req.query;
    const { skip, take, page: pageNum, limit: limitNum } = getPagination(page, limit);

    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true },
          },
          payment: {
            select: { status: true, method: true },
          },
          _count: {
            select: { orderItems: true },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    const formattedOrders = orders.map(order => ({
      ...order,
      totalAmount: parseFloat(order.totalAmount),
      itemCount: order._count.orderItems,
    }));

    const pagination = formatPaginationResponse(total, pageNum, limitNum);
    return paginated(res, formattedOrders, pagination);
  } catch (err) {
    next(err);
  }
};

/**
 * Get order by order number
 * GET /api/orders/number/:orderNumber
 */
const getOrderByNumber = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;

    const where = { orderNumber };
    // Non-admin users can only see their own orders
    if (req.user.role !== 'ADMIN') {
      where.userId = req.user.id;
    }

    const order = await prisma.order.findFirst({
      where,
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true, phone: true },
        },
        address: true,
        orderItems: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
          },
        },
        payment: true,
      },
    });

    if (!order) {
      return notFound(res, 'Order not found');
    }

    // Format order
    const formattedOrder = {
      ...order,
      subtotal: parseFloat(order.subtotal),
      tax: parseFloat(order.tax),
      shippingCharge: parseFloat(order.shippingCharge),
      discount: parseFloat(order.discount),
      totalAmount: parseFloat(order.totalAmount),
      orderItems: order.orderItems.map(item => ({
        ...item,
        unitPrice: parseFloat(item.unitPrice),
        total: parseFloat(item.total),
        productImage: item.product.images?.[0]?.imageUrl || null,
      })),
    };

    return success(res, formattedOrder);
  } catch (err) {
    next(err);
  }
};

/**
 * Initiate payment for an order
 * POST /api/orders/:id/initiate-payment
 * This creates a payment session for the payment gateway
 */
const initiatePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentMethod } = req.body;

    const order = await prisma.order.findFirst({
      where: { id, userId: req.user.id },
      include: { payment: true },
    });

    if (!order) {
      return notFound(res, 'Order not found');
    }

    if (order.status !== 'PENDING') {
      return badRequest(res, 'Payment can only be initiated for pending orders');
    }

    // Generate a mock payment session/transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Update payment with transaction ID and method
    await prisma.payment.update({
      where: { orderId: id },
      data: {
        method: paymentMethod,
        transactionId,
        status: 'PENDING',
      },
    });

    // Return payment gateway URL (mock)
    const paymentGatewayData = {
      orderId: id,
      orderNumber: order.orderNumber,
      amount: parseFloat(order.totalAmount),
      transactionId,
      paymentMethod,
      // In real implementation, this would be actual payment gateway URL
      gatewayUrl: `/payment/${id}?txn=${transactionId}`,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    };

    return success(res, paymentGatewayData, 'Payment session created');
  } catch (err) {
    next(err);
  }
};

/**
 * Verify payment and confirm order
 * POST /api/orders/:id/verify-payment
 * Called after payment gateway redirect
 */
const verifyPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { transactionId, status, paymentMethod } = req.body;

    const order = await prisma.order.findFirst({
      where: { id, userId: req.user.id },
      include: { payment: true },
    });

    if (!order) {
      return notFound(res, 'Order not found');
    }

    // Verify transaction ID matches (allow if transactionId not set yet for backward compatibility)
    if (order.payment?.transactionId && order.payment.transactionId !== transactionId) {
      return badRequest(res, 'Invalid transaction ID mismatch');
    }

    // Handle different payment statuses
    if (status === 'SUCCESS') {
      // Payment successful - confirm order
      await prisma.$transaction(async (tx) => {
        // Update payment status
        await tx.payment.update({
          where: { orderId: id },
          data: {
            status: paymentMethod === 'COD' ? 'PENDING' : 'COMPLETED',
            paidAt: paymentMethod === 'COD' ? null : new Date(),
          },
        });

        // Update order status to CONFIRMED
        await tx.order.update({
          where: { id },
          data: { status: 'CONFIRMED' },
        });
      });

      const updatedOrder = await prisma.order.findUnique({
        where: { id },
        include: {
          payment: true,
          address: true,
          orderItems: {
            include: {
              product: {
                include: {
                  images: { where: { isPrimary: true }, take: 1 },
                },
              },
            },
          },
        },
      });

      return success(res, {
        order: {
          ...updatedOrder,
          totalAmount: parseFloat(updatedOrder.totalAmount),
        },
        message: 'Payment successful! Your order has been confirmed.',
      });
    } else if (status === 'FAILED') {
      // Payment failed - restore stock and cancel order
      await prisma.$transaction(async (tx) => {
        // Update payment status
        await tx.payment.update({
          where: { orderId: id },
          data: { status: 'FAILED' },
        });

        // Update order status to CANCELLED
        await tx.order.update({
          where: { id },
          data: { status: 'CANCELLED' },
        });

        // Restore stock
        const orderItems = await tx.orderItem.findMany({
          where: { orderId: id },
        });

        for (const item of orderItems) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });

          const newStock = product.stockQuantity + item.quantity;

          await tx.product.update({
            where: { id: item.productId },
            data: { stockQuantity: newStock },
          });

          await tx.inventoryLog.create({
            data: {
              productId: item.productId,
              changeQty: item.quantity,
              prevQty: product.stockQuantity,
              newQty: newStock,
              reason: 'RETURNED',
              notes: `Payment failed for Order ${order.orderNumber}`,
            },
          });
        }
      });

      return badRequest(res, 'Payment failed. Order has been cancelled and stock restored.');
    } else {
      return badRequest(res, 'Invalid payment status');
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOrders,
  getOrder,
  getOrderByNumber,
  createOrder,
  initiatePayment,
  verifyPayment,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
};
