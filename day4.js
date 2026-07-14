import http from 'http';

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('home page');
    } else if (req.url === '/api') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'api data works' }));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404: not found');
    }
});

server.listen(3000, () => {
    console.log('server listening on port 3000...');
});
