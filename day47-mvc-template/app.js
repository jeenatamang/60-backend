import express from 'express';
import cors from 'cors';
import AppError from './utils/AppError.js';
import userRoutes from './routes/user.routes.js';
import errorMiddleware from './middleware/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/users', userRoutes);

app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorMiddleware);

export default app;
