import express from 'express';

const router = express.Router();
let users = [
  { id: 1, name: "Sandesh", email: "sandesh@example.com" },
  { id: 2, name: "Aakriti", email: "aakriti@example.com" }
];
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    data: users
  });
});
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.status(200).json({ success: true, data: user });
});
router.post('/', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: "Name and email are required" });
  }
  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.status(201).json({ success: true, message: "User created", data: newUser });
});
router.delete('/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  users.splice(index, 1);
  res.status(200).json({ success: true, message: "User deleted" });
});

export default router;
