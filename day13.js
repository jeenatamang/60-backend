import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to the homepage');
});

app.get('/broken-route', (req, res, next) => {
    const systemError = new Error('Database connection failed!');
    next(systemError);
});

app.use((err, req, res, next) => {
    console.error('SERVER LOG [ALERT]:', err.message);
    res.status(500).send('Something went wrong. Please try again later.');
});

app.listen(3000, () => {
    console.log('Error-secure server running on port 3000');
});
