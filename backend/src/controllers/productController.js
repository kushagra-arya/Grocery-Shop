const prisma = require('../config/database');
const { success, created, notFound, paginated } = require('../utils/response');
const { generateSlug, getPagination, formatPaginationResponse } = require('../utils/helpers');
const fs = require('fs');
const path = require('path');

/**
 * Get all products with filters
 * GET /api/products
 */
const getProducts = async (req, res, next) => {
  try {
    const { 
      page, 
      limit, 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      sortBy = 'createdAt',
      order = 'desc',
      featured
    } = req.query;

    const { skip, take, page: pageNum, limit: limitNum } = getPagination(page, limit);

    // Build where clause
    const where = {
      isActive: true,
    };

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      // SQLite doesn't support 'mode: insensitive', so we use raw SQL or simple contains
      // For case-insensitive search in SQLite, we lowercase both the field and search term
      const searchLower = search.toLowerCase();
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    // Build order by
    const orderBy = {};
    const validSortFields = ['price', 'name', 'createdAt', 'stockQuantity'];
    if (validSortFields.includes(sortBy)) {
      orderBy[sortBy] = order === 'asc' ? 'asc' : 'desc';
    }

    // Get products with count
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          _count: {
            select: { reviews: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Get average ratings for products
    const productIds = products.map(p => p.id);
    const ratings = await prisma.review.groupBy({
      by: ['productId'],
      where: { productId: { in: productIds } },
      _avg: { rating: true },
    });

    const ratingsMap = ratings.reduce((acc, r) => {
      acc[r.productId] = r._avg.rating;
      return acc;
    }, {});

    // Format products
    const formattedProducts = products.map(product => ({
      ...product,
      price: parseFloat(product.price),
      comparePrice: product.comparePrice ? parseFloat(product.comparePrice) : null,
      primaryImage: product.images[0]?.imageUrl || null,
      avgRating: ratingsMap[product.id] || 0,
      reviewCount: product._count.reviews,
    }));

    const pagination = formatPaginationResponse(total, pageNum, limitNum);
    return paginated(res, formattedProducts, pagination);
  } catch (err) {
    next(err);
  }
};

/**
 * Get single product by ID or slug
 * GET /api/products/:id
 */
const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if id is UUID or slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    const where = isUUID ? { id } : { slug: id };

    const product = await prisma.product.findFirst({
      where: { ...where, isActive: true },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        reviews: {
          where: { isVisible: true },
          include: {
            user: {
              select: { firstName: true, lastName: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      return notFound(res, 'Product not found');
    }

    // Get average rating
    const ratingAgg = await prisma.review.aggregate({
      where: { productId: product.id },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const formattedProduct = {
      ...product,
      price: parseFloat(product.price),
      comparePrice: product.comparePrice ? parseFloat(product.comparePrice) : null,
      avgRating: ratingAgg._avg.rating || 0,
      reviewCount: ratingAgg._count.rating,
    };

    return success(res, formattedProduct);
  } catch (err) {
    next(err);
  }
};

/**
 * Create new product (Admin)
 * POST /api/products
 */
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      comparePrice,
      sku,
      categoryId,
      stockQuantity = 0,
      unit = 'piece',
      isActive = true,
      isFeatured = false,
      lowStockAlert = 10,
    } = req.body;

    const slug = generateSlug(name);

    // Check for duplicate slug
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    const finalSlug = existingProduct 
      ? `${slug}-${Date.now().toString(36)}`
      : slug;

    // Build image data from uploaded files
    const imageCreates = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        imageCreates.push({
          imageUrl: `/uploads/${file.filename}`,
          altText: name,
          isPrimary: index === 0,
          sortOrder: index,
        });
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        description,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        sku: sku || null,
        categoryId,
        stockQuantity: parseInt(stockQuantity),
        unit,
        isActive: isActive === 'true' || isActive === true,
        isFeatured: isFeatured === 'true' || isFeatured === true,
        lowStockAlert: parseInt(lowStockAlert),
        images: {
          create: imageCreates,
        },
      },
      include: {
        category: true,
        images: true,
      },
    });

    // Create inventory log for initial stock
    if (parseInt(stockQuantity) > 0) {
      await prisma.inventoryLog.create({
        data: {
          productId: product.id,
          adminId: req.user.id,
          changeQty: parseInt(stockQuantity),
          prevQty: 0,
          newQty: parseInt(stockQuantity),
          reason: 'RESTOCK',
          notes: 'Initial stock',
        },
      });
    }

    return created(res, product, 'Product created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Update product (Admin)
 * PUT /api/products/:id
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, comparePrice, sku, categoryId, stockQuantity, unit, isActive, isFeatured, lowStockAlert, existingImages } = req.body;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existingProduct) {
      return notFound(res, 'Product not found');
    }

    // Build update data - only include fields that are provided
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (comparePrice !== undefined) updateData.comparePrice = comparePrice ? parseFloat(comparePrice) : null;
    if (sku !== undefined) updateData.sku = sku || null;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (stockQuantity !== undefined) updateData.stockQuantity = parseInt(stockQuantity);
    if (unit !== undefined) updateData.unit = unit;
    if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured === 'true' || isFeatured === true;
    if (lowStockAlert !== undefined) updateData.lowStockAlert = parseInt(lowStockAlert);

    // Update slug if name changed
    if (updateData.name && updateData.name !== existingProduct.name) {
      updateData.slug = generateSlug(updateData.name);
      
      // Check for duplicate slug
      const slugExists = await prisma.product.findFirst({
        where: { slug: updateData.slug, id: { not: id } },
      });
      
      if (slugExists) {
        updateData.slug = `${updateData.slug}-${Date.now().toString(36)}`;
      }
    }

    // Handle images
    // existingImages = JSON array of image URLs to KEEP from the old images
    // req.files = new files to ADD
    let keptImageUrls = [];
    if (existingImages) {
      try {
        keptImageUrls = JSON.parse(existingImages);
      } catch (e) {
        keptImageUrls = Array.isArray(existingImages) ? existingImages : [existingImages];
      }
    }

    const hasNewFiles = req.files && req.files.length > 0;
    const hasExistingImagesField = existingImages !== undefined;

    if (hasExistingImagesField || hasNewFiles) {
      // Find images to delete (ones NOT in keptImageUrls)
      const imagesToDelete = existingProduct.images.filter(
        img => !keptImageUrls.includes(img.imageUrl)
      );

      // Delete removed image files from disk
      for (const img of imagesToDelete) {
        if (img.imageUrl && img.imageUrl.startsWith('/uploads/')) {
          const filePath = path.join(__dirname, '../../', img.imageUrl);
          try { fs.unlinkSync(filePath); } catch (e) { /* file may not exist */ }
        }
      }

      // Delete removed image records from DB
      if (imagesToDelete.length > 0) {
        await prisma.productImage.deleteMany({
          where: { id: { in: imagesToDelete.map(i => i.id) } },
        });
      }

      // Add new uploaded images
      if (hasNewFiles) {
        const existingCount = keptImageUrls.length;
        for (let index = 0; index < req.files.length; index++) {
          const file = req.files[index];
          await prisma.productImage.create({
            data: {
              productId: id,
              imageUrl: `/uploads/${file.filename}`,
              altText: updateData.name || existingProduct.name,
              isPrimary: existingCount === 0 && index === 0,
              sortOrder: existingCount + index,
            },
          });
        }
      }

      // If no images remain with isPrimary, set the first one
      const remainingImages = await prisma.productImage.findMany({
        where: { productId: id },
        orderBy: { sortOrder: 'asc' },
      });
      if (remainingImages.length > 0 && !remainingImages.some(i => i.isPrimary)) {
        await prisma.productImage.update({
          where: { id: remainingImages[0].id },
          data: { isPrimary: true },
        });
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        images: true,
      },
    });

    return success(res, product, 'Product updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Delete product (Admin)
 * DELETE /api/products/:id
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return notFound(res, 'Product not found');
    }

    // Soft delete by setting isActive to false
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return success(res, null, 'Product deleted successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Get featured products
 * GET /api/products/featured
 */
const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      take: 8,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
    });

    const formattedProducts = products.map(product => ({
      ...product,
      price: parseFloat(product.price),
      comparePrice: product.comparePrice ? parseFloat(product.comparePrice) : null,
      primaryImage: product.images[0]?.imageUrl || null,
    }));

    return success(res, formattedProducts);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
};
