import 'dotenv/config';

import express from 'express';

const app = express();

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;
const APP_NAME = process.env.APP_NAME;
app.get('/', (req, res) => {
  res.json({
    message: `Welcome to ${APP_NAME}`,
    port: PORT
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Connecting to DB at: ${DB_URI}`);
});
