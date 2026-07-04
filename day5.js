import http from 'http';

const server = http.createServer((req, res) => {
    // log the request method and the user's browser details
    console.log('method:', req.method);
    console.log('user-agent:', req.headers['user-agent']);
    // restrict endpoint to GET requests only
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('get request accepted');
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('method not allowed');
    }
});

server.listen(3000, () => {
    console.log('server running on 3000...');
});
