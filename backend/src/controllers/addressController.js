const prisma = require('../config/database');
const { success, created, notFound, badRequest } = require('../utils/response');

/**
 * Get user's addresses
 * GET /api/addresses
 */
const getAddresses = async (req, res, next) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return success(res, addresses);
  } catch (err) {
    next(err);
  }
};

/**
 * Get single address
 * GET /api/addresses/:id
 */
const getAddress = async (req, res, next) => {
  try {
    const { id } = req.params;

    const address = await prisma.address.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!address) {
      return notFound(res, 'Address not found');
    }

    return success(res, address);
  } catch (err) {
    next(err);
  }
};

/**
 * Create new address
 * POST /api/addresses
 */
const createAddress = async (req, res, next) => {
  try {
    const {
      fullName,
      phone,
      street,
      landmark,
      city,
      state,
      postalCode,
      country = 'India',
      isDefault = false,
    } = req.body;

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false },
      });
    }

    // Check if this is the first address (make it default)
    const addressCount = await prisma.address.count({
      where: { userId: req.user.id },
    });

    const address = await prisma.address.create({
      data: {
        userId: req.user.id,
        fullName,
        phone,
        street,
        landmark,
        city,
        state,
        postalCode,
        country,
        isDefault: isDefault || addressCount === 0,
      },
    });

    return created(res, address, 'Address added successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Update address
 * PUT /api/addresses/:id
 */
const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingAddress) {
      return notFound(res, 'Address not found');
    }

    // If setting as default, unset other defaults
    if (updateData.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: req.user.id,
          id: { not: id },
        },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: updateData,
    });

    return success(res, address, 'Address updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Delete address
 * DELETE /api/addresses/:id
 */
const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if address exists and belongs to user
    const address = await prisma.address.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!address) {
      return notFound(res, 'Address not found');
    }

    // Note: We allow deletion even if address is used in orders
    // Orders will keep the address ID for historical reference
    // but the address details are already captured in the order
    
    await prisma.address.delete({ where: { id } });

    // If deleted address was default, set another as default
    if (address.isDefault) {
      const firstAddress = await prisma.address.findFirst({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
      });

      if (firstAddress) {
        await prisma.address.update({
          where: { id: firstAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return success(res, null, 'Address deleted successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Set address as default
 * PUT /api/addresses/:id/default
 */
const setDefaultAddress = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if address exists and belongs to user
    const address = await prisma.address.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!address) {
      return notFound(res, 'Address not found');
    }

    // Unset all defaults and set this one
    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false },
      }),
      prisma.address.update({
        where: { id },
        data: { isDefault: true },
      }),
    ]);

    return success(res, null, 'Default address updated');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
