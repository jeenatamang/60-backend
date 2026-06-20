require('dotenv').config();
const express = require('express');
const AppError = require('./utils/AppError');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
let products = [
  { id: 1, name: "Laptop", price: 85000 },
  { id: 2, name: "Headphones", price: 2500 }
];
app.post('/products', (req, res, next) => {
  try {
    const { name, price } = req.body;
    if (!name || !price) {
      throw new AppError("Name and price are required", 400);
    }
    const newProduct = {
      id: products.length + 1,
      name,
      price
    };
    products.push(newProduct);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct
    });
  } catch (err) {
    next(err);
  }
});
app.get('/products', (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products
    });
  } catch (err) {
    next(err);
  }
});

app.get('/products/:id', (req, res, next) => {
  try {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product
    });
  } catch (err) {
    next(err);
  }
});
app.patch('/products/:id', (req, res, next) => {
  try {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    const { name, price } = req.body;
    if (name) product.name = name;
    if (price) product.price = price;

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product
    });
  } catch (err) {
    next(err);
  }
});
app.delete('/products/:id', (req, res, next) => {
  try {
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
      throw new AppError("Product not found", 404);
    }
    products.splice(index, 1);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (err) {
    next(err);
  }
});
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});