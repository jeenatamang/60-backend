const http = require('http');

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/data') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            console.log('received payload:', body);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('data received successfully');
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('not found');
    }
});

server.listen(3000, () => {
    console.log('server listening on 3000...');
});


