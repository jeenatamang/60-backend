require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/users.routes');
const productRoutes = require('./routes/products.routes');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.use('/users', userRoutes);
app.use('/products', productRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Routes available:`);
  console.log(`  → http://localhost:${PORT}/users`);
  console.log(`  → http://localhost:${PORT}/products`);
});

