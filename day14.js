import express from 'express';
import userRoutes from './userRoutes.js';

const app = express();
app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the central homepage');
});
app.listen(3000, () => {
    console.log('Modular server running on port 3000');
});
