require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const watchlistItems = [
  { id: 1, title: "Attack on Titan", type: "anime", status: "completed", rating: 9 },
  { id: 2, title: "Inception", type: "movie", status: "completed", rating: 8 },
  { id: 3, title: "Demon Slayer", type: "anime", status: "watching", rating: null }
];

app.get('/home', (req, res) => {
  res.render('home', {
    title: 'Welcome to WatchList',
    description: 'Track your movies and anime in one place.'
  });
});

app.get('/watchlist', (req, res) => {
  res.render('watchlist', {
    items: watchlistItems
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});