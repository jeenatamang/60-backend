import express from 'express';
import cors from 'cors';
import AppError from './utils/Apperror.js';
import brandRoutes from './routes/brand.routes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/brands', brandRoutes);

app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export default app;
