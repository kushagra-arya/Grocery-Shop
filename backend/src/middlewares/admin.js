const { forbidden } = require('../utils/response');
const { USER_ROLES } = require('../config/constants');

/**
 * Admin Role Middleware
 * Checks if authenticated user has admin role
 */
const admin = (req, res, next) => {
  if (!req.user) {
    return forbidden(res, 'Authentication required');
  }

  if (req.user.role !== USER_ROLES.ADMIN) {
    return forbidden(res, 'Admin access required');
  }

  next();
};

/**
 * Role Check Middleware Factory
 * Creates middleware that checks for specific roles
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return forbidden(res, 'Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      return forbidden(res, `Access restricted to: ${roles.join(', ')}`);
    }

    next();
  };
};

module.exports = { admin, requireRole };
