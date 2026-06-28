const fs = require('fs');

const readStream = fs.createReadStream('./sample.txt');

const writeStream = fs.createWriteStream('./sample-copy.txt');
readStream.pipe(writeStream);

writeStream.on('finish', () => {
  console.log('File copied successfully using streams!');
  console.log('Check sample-copy.txt in your folder.');
});

