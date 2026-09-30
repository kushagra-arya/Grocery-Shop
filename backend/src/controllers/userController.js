const prisma = require('../config/database');
const { success, paginated } = require('../utils/response');
const { getPagination, formatPaginationResponse } = require('../utils/helpers');

/**
 * Get all users (Admin)
 * GET /api/users
 */
const getUsers = async (req, res, next) => {
  try {
    const { page, limit, role, search } = req.query;
    const { skip, take, page: pageNum, limit: limitNum } = getPagination(page, limit);

    const where = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          _count: {
            select: { orders: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    const pagination = formatPaginationResponse(total, pageNum, limitNum);
    return paginated(res, users, pagination);
  } catch (err) {
    next(err);
  }
};

/**
 * Get single user (Admin)
 * GET /api/users/:id
 */
const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        addresses: true,
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return success(res, user);
  } catch (err) {
    next(err);
  }
};

/**
 * Update user role (Admin)
 * PUT /api/users/:id/role
 */
const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['CUSTOMER', 'ADMIN'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
    }

    // Prevent self role change
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role',
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    return success(res, user, 'User role updated');
  } catch (err) {
    next(err);
  }
};

/**
 * Toggle user active status (Admin)
 * PUT /api/users/:id/status
 */
const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent self deactivation
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        email: true,
        isActive: true,
      },
    });

    // If deactivated, invalidate all refresh tokens
    if (!updatedUser.isActive) {
      await prisma.refreshToken.deleteMany({
        where: { userId: id },
      });
    }

    return success(res, updatedUser, `User ${updatedUser.isActive ? 'activated' : 'deactivated'}`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUserRole,
  toggleUserStatus,
};
