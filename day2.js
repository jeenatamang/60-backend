const fs = require('fs');

// 1. Write data to a file
fs.writeFileSync('sample.txt', 'hello world');

// 2. Read data back asynchronously
fs.readFile('sample.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
});