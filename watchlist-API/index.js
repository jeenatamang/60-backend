const cors = require('cors');
require('dotenv').config();
const express = require('express');
const AppError = require('./utils/AppError');
const watchlistRoutes = require('./routes/watchlist.routes');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.use('/watchlist', watchlistRoutes);

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