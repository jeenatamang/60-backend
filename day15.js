import express from 'express';
import fs from 'fs';

const app = express();

app.use(express.json());
const DATA_FILE = './database.json';
app.post('/save', (req, res) => {
    const newData = req.body;

    fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2));
    
    res.send('Data safely saved to the database file!');
});
app.listen(3000, () => {
    console.log('Database server active on port 3000');
});
