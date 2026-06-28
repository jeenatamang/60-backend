require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/file-wrong', (req, res) => {
  const filePath = path.join(__dirname, 'sample.txt');
  const content = fs.readFileSync(filePath, 'utf8'); 
  res.send(content);
});

app.get('/file-right', (req, res) => {
  const filePath = path.join(__dirname, 'sample.txt');
  const readStream = fs.createReadStream(filePath);

  readStream.on('error', (err) => {
    res.status(404).json({ success: false, message: 'File not found' });
  });

  res.setHeader('Content-Type', 'text/plain');
  readStream.pipe(res); 
});

app.get('/download', (req, res) => {
  const filePath = path.join(__dirname, 'sample.txt');

  res.setHeader('Content-Disposition', 'attachment; filename="sample.txt"');
  res.setHeader('Content-Type', 'text/plain');

  const readStream = fs.createReadStream(filePath);
  readStream.on('error', () => {
    res.status(404).json({ success: false, message: 'File not found' });
  });
  readStream.pipe(res);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Try these in your browser:`);
  console.log(`  http://localhost:${PORT}/file-wrong`);
  console.log(`  http://localhost:${PORT}/file-right`);
  console.log(`  http://localhost:${PORT}/download`);
});