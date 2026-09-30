const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const { auth, isAdmin } = require('../middlewares/auth');
const { admin } = require('../middlewares/admin');
const { success: successResponse, error: errorResponseFn, badRequest, notFound } = require('../utils/response');

// Helper to match the errorResponse(res, message, code) pattern used throughout
const errorResponse = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({ success: false, message });
};

// Apply auth and admin middleware to all routes
router.use(auth, admin);

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalCategories,
      revenueResult,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.category.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { not: 'CANCELLED' } },
      }),
    ]);

    return successResponse(res, {
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalCategories,
        totalRevenue: parseFloat(revenueResult._sum.totalAmount || 0),
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return errorResponse(res, 'Failed to get statistics', 500);
  }
});

// Get all orders (admin)
router.get('/orders', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.order.count({ where }),
    ]);

    return successResponse(res, {
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return errorResponse(res, 'Failed to get orders', 500);
  }
});

// Update order status (admin)
router.patch('/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return errorResponse(res, 'Invalid status', 400);
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    // Prevent updating completed orders
    if (['DELIVERED', 'CANCELLED'].includes(order.status)) {
      return errorResponse(res, 'Cannot update completed or cancelled orders', 400);
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: true,
          },
        },
        address: true,
        payment: true,
      },
    });

    // If order is cancelled, restore product stock
    if (status === 'CANCELLED' && order.status !== 'CANCELLED') {
      for (const item of updatedOrder.orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: { increment: item.quantity },
          },
        });
      }
    }

    return successResponse(res, { order: updatedOrder }, 'Order status updated');
  } catch (error) {
    console.error('Update order status error:', error);
    return errorResponse(res, 'Failed to update order status', 500);
  }
});

// Get all users (admin)
router.get('/users', async (req, res) => {
  try {
    const { role, page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (role && role !== 'ALL') {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          avatar: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.user.count({ where }),
    ]);

    // Transform users to match frontend expectations
    const transformedUsers = users.map(user => ({
      ...user,
      name: `${user.firstName} ${user.lastName}`,
      status: user.isActive ? 'ACTIVE' : 'BLOCKED',
    }));

    return successResponse(res, {
      users: transformedUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    return errorResponse(res, 'Failed to get users', 500);
  }
});

// Update user role (admin)
router.patch('/users/:userId/role', async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Map USER to CUSTOMER for database
    const dbRole = role === 'USER' ? 'CUSTOMER' : role;
    
    if (!['CUSTOMER', 'ADMIN'].includes(dbRole)) {
      return errorResponse(res, 'Invalid role', 400);
    }

    // Prevent admin from changing their own role
    if (userId === req.user.id) {
      return errorResponse(res, 'Cannot change your own role', 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: dbRole },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return successResponse(res, { 
      user: {
        ...updatedUser,
        name: `${updatedUser.firstName} ${updatedUser.lastName}`,
        role: updatedUser.role === 'CUSTOMER' ? 'USER' : updatedUser.role,
        status: updatedUser.isActive ? 'ACTIVE' : 'BLOCKED',
      }
    }, 'User role updated');
  } catch (error) {
    console.error('Update user role error:', error);
    return errorResponse(res, 'Failed to update user role', 500);
  }
});

// Update user status (block/unblock)
router.patch('/users/:userId/status', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['ACTIVE', 'BLOCKED'].includes(status)) {
      return errorResponse(res, 'Invalid status', 400);
    }

    // Prevent admin from blocking themselves
    if (userId === req.user.id) {
      return errorResponse(res, 'Cannot block yourself', 400);
    }

    const isActive = status === 'ACTIVE';

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return successResponse(res, { 
      user: {
        ...updatedUser,
        name: `${updatedUser.firstName} ${updatedUser.lastName}`,
        status: updatedUser.isActive ? 'ACTIVE' : 'BLOCKED',
      }
    }, `User ${status === 'BLOCKED' ? 'blocked' : 'unblocked'}`);
  } catch (error) {
    console.error('Update user status error:', error);
    return errorResponse(res, 'Failed to update user status', 500);
  }
});

// Get inventory/stock levels
router.get('/inventory', async (req, res) => {
  try {
    const { lowStock } = req.query;

    const where = lowStock === 'true' ? {
      stock: { lte: 10 },
    } : {};

    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
        price: true,
        category: {
          select: { name: true },
        },
        images: {
          take: 1,
          select: { url: true },
        },
      },
      orderBy: { stock: 'asc' },
    });

    return successResponse(res, { products });
  } catch (error) {
    console.error('Get inventory error:', error);
    return errorResponse(res, 'Failed to get inventory', 500);
  }
});

// Update product stock
router.patch('/inventory/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { stock, reason } = req.body;

    if (typeof stock !== 'number' || stock < 0) {
      return errorResponse(res, 'Invalid stock value', 400);
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    const oldStock = product.stock;

    // Update product stock
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { stock },
      include: {
        category: true,
        images: { take: 1 },
      },
    });

    // Log inventory change
    await prisma.inventoryLog.create({
      data: {
        productId,
        previousQuantity: oldStock,
        newQuantity: stock,
        changeQuantity: stock - oldStock,
        reason: reason || 'MANUAL_ADJUSTMENT',
        performedBy: req.user.id,
      },
    });

    return successResponse(res, { product: updatedProduct }, 'Stock updated');
  } catch (error) {
    console.error('Update inventory error:', error);
    return errorResponse(res, 'Failed to update stock', 500);
  }
});

// ==================== CONTACT MESSAGES ====================

// Get all contact messages (admin)
router.get('/contact-messages', async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status === 'read') where.isRead = true;
    if (status === 'unread') where.isRead = false;

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.contactMessage.count({ where }),
    ]);

    return successResponse(res, { messages, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    console.error('Get contact messages error:', error);
    return errorResponse(res, 'Failed to get contact messages', 500);
  }
});

// Mark contact message as read/unread
router.put('/contact-messages/:id/read', async (req, res) => {
  try {
    const message = await prisma.contactMessage.findUnique({ where: { id: req.params.id } });
    if (!message) return errorResponse(res, 'Message not found', 404);

    const updated = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { isRead: !message.isRead },
    });

    return successResponse(res, updated);
  } catch (error) {
    console.error('Toggle message read error:', error);
    return errorResponse(res, 'Failed to update message', 500);
  }
});

// Delete contact message
router.delete('/contact-messages/:id', async (req, res) => {
  try {
    await prisma.contactMessage.delete({ where: { id: req.params.id } });
    return successResponse(res, null, 'Message deleted');
  } catch (error) {
    console.error('Delete contact message error:', error);
    return errorResponse(res, 'Failed to delete message', 500);
  }
});

module.exports = router;
