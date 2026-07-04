import express from 'express';

const app = express();

app.use(express.json());
app.get('/user', (req, res) => {
    res.send('fetching user profile data...');
});
app.post('/user', (req, res) => {
    console.log('received body:', req.body);
    res.send('user data processed');
});
app.listen(3000, () => {
    console.log('server active on 3000...');
});
