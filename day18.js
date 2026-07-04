import 'dotenv/config';
import express from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
let users = [
  { id: 1, name: "Sandesh", email: "sandesh@example.com" }
];

app.get('/users', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    data: users
  });
});
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }
  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: user
  });
});

app.post('/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: "Name and email are required"
    });
  }
  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: newUser
  });
});

app.patch('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }
  Object.assign(user, req.body);
  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user
  });
});

app.delete('/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }
  users.splice(index, 1);
  res.status(200).json({
    success: true,
    message: "User deleted successfully"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
