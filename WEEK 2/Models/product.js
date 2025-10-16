const { NotFoundError } = require('../config/middleware');

class Product {
  static products = [];

  static async getAll({ filters = {}, page = 1, limit = 10 }) {
    let filteredProducts = [...this.products];

    // Apply category filter
    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => p.category === filters.category);
    }

    // Apply search by name
    if (filters.search) {
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Pagination
    const total = filteredProducts.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    filteredProducts = filteredProducts.slice(start, end);

    return {
      data: filteredProducts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id) {
    const product = this.products.find(p => p.id === id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    return product;
  }

  static async create(data) {
    const product = { ...data, createdAt: new Date() };
    this.products.push(product);
    return product;
  }

  static async update(id, data) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new NotFoundError('Product not found');
    }
    this.products[index] = { ...this.products[index], ...data, updatedAt: new Date() };
    return this.products[index];
  }

  static async delete(id) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new NotFoundError('Product not found');
    }
    this.products.splice(index, 1);
    return true;
  }

  static async getStats() {
    const categories = {};
    this.products.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });
    return {
      totalProducts: this.products.length,
      categories,
    };
  }
}

module.exports = Product;