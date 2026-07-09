import express from 'express';
import cors from 'cors';
import AppError from './utils/AppError.js';
import watchlistRoutes from './routes/watchlist.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/watchlist', watchlistRoutes);

app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value} is not a valid ID`
    });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: messages[0],
      allErrors: messages 
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists — please use a different value`
    });
  }
  if (err.name === 'MongoNetworkError') {
    return res.status(500).json({
      success: false,
      message: 'Database connection failed — please try again later'
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token — please log in again'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired — please log in again'
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export default app;