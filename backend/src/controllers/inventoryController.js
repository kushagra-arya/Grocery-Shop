const prisma = require('../config/database');
const { success, badRequest, notFound, paginated } = require('../utils/response');
const { getPagination, formatPaginationResponse } = require('../utils/helpers');

/**
 * Get inventory overview (Admin)
 * GET /api/inventory
 */
const getInventory = async (req, res, next) => {
  try {
    const { page, limit, lowStock, search, category } = req.query;
    const { skip, take, page: pageNum, limit: limitNum } = getPagination(page, limit);

    const where = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { stockQuantity: 'asc' },
        select: {
          id: true,
          name: true,
          sku: true,
          stockQuantity: true,
          lowStockAlert: true,
          unit: true,
          price: true,
          category: {
            select: { name: true },
          },
          images: {
            where: { isPrimary: true },
            take: 1,
            select: { imageUrl: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const formattedProducts = products.map(p => ({
      ...p,
      price: parseFloat(p.price),
      image: p.images[0]?.imageUrl || null,
      isLowStock: p.stockQuantity <= p.lowStockAlert,
    }));

    // Filter for low stock after formatting if requested
    const finalProducts = lowStock === 'true'
      ? formattedProducts.filter(p => p.stockQuantity <= p.lowStockAlert)
      : formattedProducts;

    // Calculate low stock count from the full result set
    const lowStockCount = formattedProducts.filter(p => p.stockQuantity <= p.lowStockAlert && p.stockQuantity > 0).length;
    const outOfStockCount = formattedProducts.filter(p => p.stockQuantity === 0).length;

    const pagination = formatPaginationResponse(total, pageNum, limitNum);

    return res.status(200).json({
      success: true,
      data: finalProducts,
      pagination,
      summary: {
        totalProducts: total,
        lowStockCount,
        outOfStockCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get low stock products (Admin)
 * GET /api/inventory/low-stock
 */
const getLowStockProducts = async (req, res, next) => {
  try {
    const products = await prisma.$queryRaw`
      SELECT 
        p.id, p.name, p.sku, p.stock_quantity as "stockQuantity", 
        p.low_stock_alert as "lowStockAlert", p.unit, p.price,
        c.name as "categoryName",
        pi.image_url as "imageUrl"
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      WHERE p.is_active = true AND p.stock_quantity <= p.low_stock_alert
      ORDER BY p.stock_quantity ASC
      LIMIT 50
    `;

    return success(res, products);
  } catch (err) {
    next(err);
  }
};

/**
 * Restock product (Admin)
 * POST /api/inventory/restock
 */
const restockProduct = async (req, res, next) => {
  try {
    const { productId, quantity, notes } = req.body;

    if (!quantity || quantity <= 0) {
      return badRequest(res, 'Quantity must be a positive number');
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return notFound(res, 'Product not found');
    }

    const prevQty = product.stockQuantity;
    const newQty = prevQty + quantity;

    // Update stock and create log
    await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: { stockQuantity: newQty },
      }),
      prisma.inventoryLog.create({
        data: {
          productId,
          adminId: req.user.id,
          changeQty: quantity,
          prevQty,
          newQty,
          reason: 'RESTOCK',
          notes,
        },
      }),
    ]);

    return success(res, {
      productId,
      productName: product.name,
      previousQuantity: prevQty,
      addedQuantity: quantity,
      newQuantity: newQty,
    }, 'Product restocked successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Adjust stock (Admin)
 * POST /api/inventory/adjust
 */
const adjustStock = async (req, res, next) => {
  try {
    const { productId, quantity, reason, notes } = req.body;

    if (quantity === 0) {
      return badRequest(res, 'Quantity cannot be zero');
    }

    const validReasons = ['ADJUSTMENT', 'DAMAGED', 'RETURNED', 'RESTOCK'];
    if (!validReasons.includes(reason)) {
      return badRequest(res, 'Invalid reason. Must be: ADJUSTMENT, DAMAGED, RETURNED, or RESTOCK');
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return notFound(res, 'Product not found');
    }

    const prevQty = product.stockQuantity;
    const newQty = prevQty + quantity;

    if (newQty < 0) {
      return badRequest(res, 'Stock cannot go below zero');
    }

    // Update stock and create log
    await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: { stockQuantity: newQty },
      }),
      prisma.inventoryLog.create({
        data: {
          productId,
          adminId: req.user.id,
          changeQty: quantity,
          prevQty,
          newQty,
          reason,
          notes,
        },
      }),
    ]);

    return success(res, {
      productId,
      productName: product.name,
      previousQuantity: prevQty,
      adjustment: quantity,
      newQuantity: newQty,
      reason,
    }, 'Stock adjusted successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Get inventory logs (Admin)
 * GET /api/inventory/logs
 */
const getInventoryLogs = async (req, res, next) => {
  try {
    const { page, limit, productId, reason } = req.query;
    const { skip, take, page: pageNum, limit: limitNum } = getPagination(page, limit);

    const where = {};
    if (productId) where.productId = productId;
    if (reason) where.reason = reason;

    const [logs, total] = await Promise.all([
      prisma.inventoryLog.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            select: { name: true, sku: true },
          },
          admin: {
            select: { firstName: true, lastName: true },
          },
        },
      }),
      prisma.inventoryLog.count({ where }),
    ]);

    const pagination = formatPaginationResponse(total, pageNum, limitNum);
    return paginated(res, logs, pagination);
  } catch (err) {
    next(err);
  }
};

/**
 * Get product inventory history (Admin)
 * GET /api/inventory/product/:productId/history
 */
const getProductInventoryHistory = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { limit = 20 } = req.query;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, sku: true, stockQuantity: true },
    });

    if (!product) {
      return notFound(res, 'Product not found');
    }

    const logs = await prisma.inventoryLog.findMany({
      where: { productId },
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        admin: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    return success(res, {
      product,
      history: logs,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getInventory,
  getLowStockProducts,
  restockProduct,
  adjustStock,
  getInventoryLogs,
  getProductInventoryHistory,
};
