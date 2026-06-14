// userRoutes.js: A mini router just for user endpoints
const express = require('express');
const router = express.Router();

// This handles: GET /users/
router.get('/', (req, res) => {
    res.send('List of all active users');
});

// This handles: GET /users/profile
router.get('/profile', (req, res) => {
    res.send('User profile dashboard details');
});

module.exports = router;


