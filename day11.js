import express from 'express';

const app = express();

app.use((req, res, next) => {
    console.log(`Request type: ${req.method} to ${req.url}`);

    next(); 
});
app.get('/', (req, res) => {
    res.send('Welcome page');
});
app.get('/dashboard', (req, res) => {
    res.send('Dashboard page');
});
app.listen(3000, () => {
    console.log('Server running on 3000');
});
