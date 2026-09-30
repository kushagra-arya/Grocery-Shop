/**
 * Generate URL-friendly slug from string
 */
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Generate unique order number
 */
const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const timestamp = Date.now().toString().slice(-4);
  return `ORD-${year}-${timestamp}${random}`;
};

/**
 * Calculate pagination offset
 */
const getPagination = (page = 1, limit = 12) => {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;
  
  return {
    skip,
    take: limitNum,
    page: pageNum,
    limit: limitNum,
  };
};

/**
 * Format pagination response
 */
const formatPaginationResponse = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

/**
 * Parse decimal to float (for Prisma Decimal)
 */
const parseDecimal = (value) => {
  if (typeof value === 'object' && value !== null) {
    return parseFloat(value.toString());
  }
  return parseFloat(value);
};

module.exports = {
  generateSlug,
  generateOrderNumber,
  getPagination,
  formatPaginationResponse,
  parseDecimal,
};
