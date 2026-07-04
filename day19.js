import 'dotenv/config';
import express from 'express';
import AppError from './utils/AppError.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
let users = [
  { id: 1, name: "Karma", email: "Karma@test.com" }
];
app.get('/users', (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users
    });
  } catch (err) {
    next(err);
  }
});
app.get('/users/:id', (req, res, next) => {
  try {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
      throw new AppError("User not found", 404);
    }
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user
    });
  } catch (err) {
    next(err);
  }
});

app.post('/users', (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      throw new AppError("Name and email are required", 400);
    }
    const newUser = { id: users.length + 1, name, email };
    users.push(newUser);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser
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
