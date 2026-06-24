const express = require('express');
const router = express.Router();

let products = [
  { id: 1, name: "Laptop", price: 75000 },
  { id: 2, name: "Headphones", price: 2500 }
];
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    data: products
  });
});
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  res.status(200).json({ success: true, data: product });
});
router.post('/', (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ success: false, message: "Name and price are required" });
  }
  const newProduct = { id: products.length + 1, name, price };
  products.push(newProduct);
  res.status(201).json({ success: true, message: "Product created", data: newProduct });
});
router.delete('/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  products.splice(index, 1);
  res.status(200).json({ success: true, message: "Product deleted" });
});

module.exports = router;