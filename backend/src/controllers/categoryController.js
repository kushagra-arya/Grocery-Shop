const prisma = require('../config/database');
const { success, created, notFound } = require('../utils/response');
const { generateSlug } = require('../utils/helpers');

/**
 * Get all categories
 * GET /api/categories
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
      orderBy: { name: 'asc' },
    });

    const formattedCategories = categories.map(cat => ({
      ...cat,
      productCount: cat._count.products,
    }));

    return success(res, formattedCategories);
  } catch (err) {
    next(err);
  }
};

/**
 * Get single category
 * GET /api/categories/:id
 */
const getCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const where = isUUID ? { id } : { slug: id };

    const category = await prisma.category.findFirst({
      where: { ...where, isActive: true },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
    });

    if (!category) {
      return notFound(res, 'Category not found');
    }

    return success(res, {
      ...category,
      productCount: category._count.products,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create category (Admin)
 * POST /api/categories
 */
const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const slug = generateSlug(name);
    
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        imageUrl,
      },
    });

    return created(res, category, 'Category created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Update category (Admin)
 * PUT /api/categories/:id
 */
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const updateData = {};
    
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;
    
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    if (name) {
      updateData.slug = generateSlug(name);
    }

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    return success(res, category, 'Category updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Delete category (Admin)
 * DELETE /api/categories/:id
 */
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if category has products
    const productCount = await prisma.product.count({
      where: { categoryId: id, isActive: true },
    });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${productCount} active products`,
      });
    }

    await prisma.category.update({
      where: { id },
      data: { isActive: false },
    });

    return success(res, null, 'Category deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
