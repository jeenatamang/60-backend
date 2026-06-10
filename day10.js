const express = require('express');
const app = express();

const users = {
    1: 'Ram Sharma',
    2: 'Sita Gurung'
};
app.get('/profile/:id', (req, res) => {
    const userId = req.params.id;
    const userName = users[userId] || 'User not found';
    res.send(`Profile Page of ${userName}`);
});

app.get('/shop', (req, res) => {
    const itemType = req.query.item || 'everything';
    res.send(`Showing products for: ${itemType}`);
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});


