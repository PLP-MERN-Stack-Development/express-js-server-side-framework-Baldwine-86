const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Product = require('../models/product');
const { validateProduct, authMiddleware } = require('../config/middleware');

const router = express.Router();

// GET /api/products - List all products with filtering and pagination
router.get('/', async (req, res, next) => {
  try {
    const { category, page = 1, limit = 10, search } = req.query;
    const filters = { category, search };
    const products = await Product.getAll({ filters, page: parseInt(page), limit: parseInt(limit) });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id - Get a specific product by ID
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST /api/products - Create a new product
router.post('/', authMiddleware, validateProduct, async (req, res, next) => {
  try {
    const productData = { id: uuidv4(), ...req.body };
    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id - Update an existing product
router.put('/:id', authMiddleware, validateProduct, async (req, res, next) => {
  try {
    const product = await Product.update(req.params.id, req.body);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id - Delete a product
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const deleted = await Product.delete(req.params.id);
    if (!deleted) {
      throw new NotFoundError('Product not found');
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// GET /api/products/stats - Get product statistics
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await Product.getStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;