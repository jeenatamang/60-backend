// userRoutes.js: A mini router just for user endpoints
import express from 'express';

const router = express.Router();

// This handles: GET /users/
router.get('/', (req, res) => {
    res.send('List of all active users');
});

// This handles: GET /users/profile
router.get('/profile', (req, res) => {
    res.send('User profile dashboard details');
});

export default router;
