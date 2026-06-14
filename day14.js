const express = require('express');
const app = express();

const userRoutes = require('./userRoutes');
app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the central homepage');
});
app.listen(3000, () => {
    console.log('Modular server running on port 3000');
});



