const http = require('http');

const server = http.createServer((req, res) => {
// home route
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('home page');
    } 
// test api endpoint
    else if (req.url === '/api') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'api data works' }));
    } 
// catch-all fallback
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404: not found');
    }
});

server.listen(3000, () => {
    console.log('server listening on port 3000...');
});