const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/products');
const { errorHandler } = require('./config/middleware');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

// Mount product routes
app.use('/api/products', productRoutes);

// Global error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});