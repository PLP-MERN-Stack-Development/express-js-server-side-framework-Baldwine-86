const { ValidationError, NotFoundError } = require('./errors');

// Custom logger middleware
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
};

// Authentication middleware (checks for API key in headers)
const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== 'your-secret-api-key') { // Replace with a secure key in production
    throw new ValidationError('Invalid or missing API key', 401);
  }
  next();
};

// Validation middleware for product creation and update
const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  if (!name || typeof name !== 'string') {
    throw new ValidationError('Name is required and must be a string');
  }
  if (!description || typeof description !== 'string') {
    throw new ValidationError('Description is required and must be a string');
  }
  if (!price || typeof price !== 'number' || price < 0) {
    throw new ValidationError('Price is required and must be a non-negative number');
  }
  if (!category || typeof category !== 'string') {
    throw new ValidationError('Category is required and must be a string');
  }
  if (typeof inStock !== 'boolean') {
    throw new ValidationError('inStock must be a boolean');
  }
  next();
};

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  if (err instanceof ValidationError || err instanceof NotFoundError) {
    return res.status(err.statusCode || 400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal server error' });
};

// Custom error classes
class ValidationError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = statusCode;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

module.exports = { logger, authMiddleware, validateProduct, errorHandler, ValidationError, NotFoundError };