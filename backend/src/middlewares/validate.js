const { validationResult } = require('express-validator');
const { badRequest } = require('../utils/response');

/**
 * Validation Middleware
 * Checks for validation errors from express-validator
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    
    return badRequest(res, 'Validation failed', formattedErrors);
  }
  
  next();
};

module.exports = { validate };
