import 'dotenv/config';
import express from 'express';

const app = express();

const PORT = process.env.PORT || 3000;
const logger = (req, res, next) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.url}`);
  next();
};
app.use(express.json());
app.use(logger);

const authCheck = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  if (token !== process.env.SECRET_TOKEN) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
  next(); 
};
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the public homepage' });
});
app.get('/dashboard', authCheck, (req, res) => {
  res.json({ message: 'Welcome to your secret dashboard' });
});
app.post('/data', authCheck, (req, res) => {
  const { name } = req.body;
  res.json({ message: `Data received for ${name}` });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
