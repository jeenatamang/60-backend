const fs = require('fs');

console.log('=== READABLE STREAM ===');

const readStream = fs.createReadStream('./sample.txt', {
  encoding: 'utf8',
  highWaterMark: 64
});

readStream.on('data', (chunk) => {
  console.log('--- Chunk received ---');
  console.log(chunk);
});

readStream.on('end', () => {
  console.log('--- Stream finished ---');
});

readStream.on('error', (err) => {
  console.error('Stream error:', err.message);
});