import fs from 'fs';

fs.writeFileSync('sample.txt', 'hello world');

fs.readFile('sample.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
});
