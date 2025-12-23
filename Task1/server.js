
const http = require('http');
const PORT = 3000;

const server = http.createServer((req, res) => {

    const url = req.url;
    const method = req.method;

    if (method === 'GET' && url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Welcome to Home Page');

    } else if (method === 'GET' && url === '/info') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('This is the information page');

    } else if (method === 'POST' && url === '/submit') {
        let body = [];

        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', () => {
            const buffer = Buffer.concat(body);
            const jsonString = buffer.toString();

            try {
                const receivedData = JSON.parse(jsonString);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(receivedData));

            } catch (e) {
                console.error('Error parsing JSON:', e);
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Invalid JSON format');
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }

});
server.listen(PORT, () =>{
    console.log(`Server is running on http://localhost:${PORT}/`);
});