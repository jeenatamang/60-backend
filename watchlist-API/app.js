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
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

export default app;
