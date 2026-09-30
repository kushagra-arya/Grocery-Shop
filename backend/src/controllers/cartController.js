const prisma = require('../config/database');
const { success, badRequest, notFound } = require('../utils/response');

/**
 * Get user's cart
 * GET /api/cart
 */
const getCart = async (req, res, next) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
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
      orderBy: { createdAt: 'desc' },
    });

    // Format cart items and calculate totals
    let subtotal = 0;
    const items = cartItems.map(item => {
      const price = parseFloat(item.product.price);
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      return {
        id: item.id,
        quantity: item.quantity,
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          price,
          comparePrice: item.product.comparePrice ? parseFloat(item.product.comparePrice) : null,
          image: item.product.images[0]?.imageUrl || null,
          stockQuantity: item.product.stockQuantity,
          unit: item.product.unit,
          isActive: item.product.isActive,
        },
        itemTotal,
      };
    });

    return success(res, {
      items,
      itemCount: items.length,
      subtotal: Math.round(subtotal * 100) / 100,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Add item to cart
 * POST /api/cart/add
 */
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Check if product exists and is active
    const product = await prisma.product.findFirst({
      where: { id: productId, isActive: true },
    });

    if (!product) {
      return notFound(res, 'Product not found');
    }

    // Check stock
    if (product.stockQuantity < quantity) {
      return badRequest(res, `Only ${product.stockQuantity} items available in stock`);
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId,
        },
      },
    });

    let cartItem;

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      
      if (newQuantity > product.stockQuantity) {
        return badRequest(res, `Cannot add more items. Only ${product.stockQuantity} available in stock`);
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            select: { name: true, price: true },
          },
        },
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: req.user.id,
          productId,
          quantity,
        },
        include: {
          product: {
            select: { name: true, price: true },
          },
        },
      });
    }

    // Get updated cart count
    const cartCount = await prisma.cartItem.count({
      where: { userId: req.user.id },
    });

    return success(res, { cartItem, cartCount }, 'Item added to cart');
  } catch (err) {
    next(err);
  }
};

/**
 * Update cart item quantity
 * PUT /api/cart/update
 */
const updateCartItem = async (req, res, next) => {
  try {
    const { cartItemId, quantity } = req.body;

    if (quantity < 1) {
      return badRequest(res, 'Quantity must be at least 1');
    }

    // Get cart item
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId: req.user.id,
      },
      include: { product: true },
    });

    if (!cartItem) {
      return notFound(res, 'Cart item not found');
    }

    // Check stock
    if (quantity > cartItem.product.stockQuantity) {
      return badRequest(res, `Only ${cartItem.product.stockQuantity} items available in stock`);
    }

    // Update quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        product: {
          select: { name: true, price: true },
        },
      },
    });

    return success(res, updatedItem, 'Cart updated');
  } catch (err) {
    next(err);
  }
};

/**
 * Remove item from cart
 * DELETE /api/cart/remove/:id
 */
const removeFromCart = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if item exists and belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!cartItem) {
      return notFound(res, 'Cart item not found');
    }

    await prisma.cartItem.delete({
      where: { id },
    });

    // Get updated cart count
    const cartCount = await prisma.cartItem.count({
      where: { userId: req.user.id },
    });

    return success(res, { cartCount }, 'Item removed from cart');
  } catch (err) {
    next(err);
  }
};

/**
 * Clear entire cart
 * DELETE /api/cart/clear
 */
const clearCart = async (req, res, next) => {
  try {
    await prisma.cartItem.deleteMany({
      where: { userId: req.user.id },
    });

    return success(res, null, 'Cart cleared');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
