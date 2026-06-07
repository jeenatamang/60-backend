const http = require('http');

// create the server instance
const server = http.createServer((req, res) => {
    // set HTTP status and content headers
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello there!');
});

// make the server listen on port 3000
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

