const express = require('express');
const app = express();
const checkAdmin = (req, res, next) => {
    const password = req.query.secret;

    if (password === 'supersecret123') {
        next(); 
    } else {
        res.status(401).send('Access Denied: Incorrect or missing secret key.');
    }
};
app.get('/', (req, res) => {
    res.send('Welcome to the public homepage!');
});
app.get('/admin', checkAdmin, (req, res) => {
    res.send('Welcome to the secret admin panel!');
});
app.listen(3000, () => {
    console.log('Auth server running on port 3000');
});

