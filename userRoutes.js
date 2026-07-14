import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('List of all active users');
});

router.get('/profile', (req, res) => {
    res.send('User profile dashboard details');
});

export default router;
