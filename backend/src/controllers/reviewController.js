const prisma = require('../config/database');
const { success, created, badRequest, notFound } = require('../utils/response');

/**
 * Get product reviews
 * GET /api/reviews/product/:productId
 */
const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sortBy = 'recent' } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Determine sort order
    let orderBy = { createdAt: 'desc' };
    if (sortBy === 'helpful') {
      orderBy = { helpfulCount: 'desc' };
    } else if (sortBy === 'rating-high') {
      orderBy = { rating: 'desc' };
    } else if (sortBy === 'rating-low') {
      orderBy = { rating: 'asc' };
    }

    const [reviews, total, stats] = await Promise.all([
      prisma.review.findMany({
        where: {
          productId,
          isVisible: true,
        },
        skip,
        take,
        orderBy,
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      }),
      prisma.review.count({
        where: { productId, isVisible: true },
      }),
      prisma.review.aggregate({
        where: { productId, isVisible: true },
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ]);

    // Get rating distribution
    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: { productId, isVisible: true },
      _count: true,
    });

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingDistribution.forEach(r => {
      distribution[r.rating] = r._count;
    });

    // Check verified purchase for each review
    const reviewsWithVerification = await Promise.all(
      reviews.map(async (review) => {
        const hasPurchased = await prisma.orderItem.findFirst({
          where: {
            productId,
            order: {
              userId: review.user.id,
              status: 'DELIVERED',
            },
          },
        });
        return {
          ...review,
          verifiedPurchase: !!hasPurchased,
        };
      })
    );

    return success(res, {
      reviews: reviewsWithVerification,
      stats: {
        averageRating: stats._avg.rating || 0,
        totalReviews: stats._count.rating,
        ratingDistribution: distribution,
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create review
 * POST /api/reviews
 */
const createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment } = req.body;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return badRequest(res, 'Rating must be between 1 and 5');
    }

    // Check if product exists
    const product = await prisma.product.findFirst({
      where: { id: productId, isActive: true },
    });

    if (!product) {
      return notFound(res, 'Product not found');
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId,
        },
      },
    });

    if (existingReview) {
      return badRequest(res, 'You have already reviewed this product');
    }

    // Check if user has purchased and received this product (verified purchase)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: req.user.id,
          status: 'DELIVERED',
        },
      },
    });

    // Optionally require verified purchase for reviews
    // Uncomment the following to enforce verified purchase only:
    // if (!hasPurchased) {
    //   return badRequest(res, 'Only verified buyers can review this product');
    // }

    // Create review with verified purchase flag
    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        productId,
        rating,
        title,
        comment,
        verifiedPurchase: !!hasPurchased,
      },
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    return created(res, {
      ...review,
      verifiedPurchase: !!hasPurchased,
    }, 'Review submitted successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Update review
 * PUT /api/reviews/:id
 */
const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, title, comment } = req.body;

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return badRequest(res, 'Rating must be between 1 and 5');
    }

    // Check if review exists and belongs to user
    const existingReview = await prisma.review.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingReview) {
      return notFound(res, 'Review not found');
    }

    const review = await prisma.review.update({
      where: { id },
      data: {
        rating: rating || existingReview.rating,
        title,
        comment,
      },
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    return success(res, review, 'Review updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Delete review
 * DELETE /api/reviews/:id
 */
const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const where = { id };
    
    // Non-admin users can only delete their own reviews
    if (req.user.role !== 'ADMIN') {
      where.userId = req.user.id;
    }

    const review = await prisma.review.findFirst({ where });

    if (!review) {
      return notFound(res, 'Review not found');
    }

    await prisma.review.delete({ where: { id } });

    return success(res, null, 'Review deleted successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Toggle review visibility (Admin)
 * PUT /api/reviews/:id/visibility
 */
const toggleVisibility = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return notFound(res, 'Review not found');
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: { isVisible: !review.isVisible },
    });

    return success(res, updatedReview, `Review ${updatedReview.isVisible ? 'shown' : 'hidden'}`);
  } catch (err) {
    next(err);
  }
};

/**
 * Get user's reviews
 * GET /api/reviews/my-reviews
 */
const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedReviews = reviews.map(r => ({
      ...r,
      productImage: r.product.images?.[0]?.imageUrl || null,
    }));

    return success(res, formattedReviews);
  } catch (err) {
    next(err);
  }
};

/**
 * Mark review as helpful
 * POST /api/reviews/:id/helpful
 */
const markHelpful = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return notFound(res, 'Review not found');
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: { helpfulCount: { increment: 1 } },
    });

    return success(res, { helpfulCount: updatedReview.helpfulCount }, 'Marked as helpful');
  } catch (err) {
    next(err);
  }
};

/**
 * Check if user can review a product
 * GET /api/reviews/can-review/:productId
 */
const canReviewProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId,
        },
      },
    });

    if (existingReview) {
      return success(res, {
        canReview: false,
        reason: 'already_reviewed',
        existingReview,
      });
    }

    // Check if user has purchased and received this product
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: req.user.id,
          status: 'DELIVERED',
        },
      },
      include: {
        order: {
          select: { orderNumber: true, createdAt: true },
        },
      },
    });

    return success(res, {
      canReview: true,
      verifiedPurchase: !!hasPurchased,
      purchaseInfo: hasPurchased ? {
        orderNumber: hasPurchased.order.orderNumber,
        purchaseDate: hasPurchased.order.createdAt,
      } : null,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all reviews (Admin) - includes hidden reviews
 * GET /api/reviews/admin/all
 */
const getAllReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 200 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true },
          },
          product: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
      prisma.review.count(),
    ]);

    // Check verified purchase for each review
    const reviewsWithVerification = await Promise.all(
      reviews.map(async (review) => {
        const hasPurchased = await prisma.orderItem.findFirst({
          where: {
            productId: review.productId,
            order: {
              userId: review.user.id,
              status: 'DELIVERED',
            },
          },
        });
        return {
          ...review,
          productName: review.product?.name,
          productSlug: review.product?.slug,
          productId: review.productId,
          verifiedPurchase: !!hasPurchased,
        };
      })
    );

    return success(res, {
      reviews: reviewsWithVerification,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProductReviews,
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleVisibility,
  getMyReviews,
  markHelpful,
  canReviewProduct,
};
