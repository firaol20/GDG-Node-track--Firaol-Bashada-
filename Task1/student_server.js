
const http = require('http');
const PORT = 4000;

let students = [];
let nextId = 1;

const parseBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        req.on('end', () => {
            try {
                const jsonString = Buffer.concat(body).toString();
                resolve(JSON.parse(jsonString));
            } catch (e) {
                reject(new Error("Invalid JSON format"));
            }
        });
    });
};

const sendJsonResponse = (res, statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
};

const sendTextResponse = (res, statusCode, message) => {
    res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
    res.end(message);
};

const server = http.createServer(async (req, res) => {
    const { url, method } = req;

    if (method === 'GET' && url === '/students') {
        sendJsonResponse(res, 200, students);
        return;
    }

    const idMatch = url.match(/^\/students\/(\d+)$/);

    if (method === 'POST' && url === '/students') {
        try {
            const { name } = await parseBody(req);
            if (!name) {
                sendTextResponse(res, 400, "Error: Name field is required.");
                return;
            }

            const newStudent = {
                id: nextId++,
                name: name
            };
            students.push(newStudent);

            sendJsonResponse(res, 201, newStudent); // 201 Created
        } catch (error) {
            sendTextResponse(res, 400, error.message);
        }
        return;
    }

    if (idMatch) {
        const id = parseInt(idMatch[1]);

        const studentIndex = students.findIndex(s => s.id === id);
        const studentExists = studentIndex !== -1;

        if (method === 'PUT') {
            if (!studentExists) {
                sendTextResponse(res, 404, `Error: Student with ID ${id} not found.`);
                return;
            }
            try {
                const { name } = await parseBody(req);

                if (!name) {
                    sendTextResponse(res, 400, "Error: Name field is required for update.");
                    return;
                }
                students[studentIndex].name = name;
                sendJsonResponse(res, 200, students[studentIndex]);

            } catch (error) {
                sendTextResponse(res, 400, error.message);
            }
            return;
        }

        if (method === 'DELETE') {
            if (!studentExists) {
                sendTextResponse(res, 404, `Error: Student with ID ${id} not found.`);
                return;
            }

            students.splice(studentIndex, 1);

            sendTextResponse(res, 200, `Success: Student with ID ${id} removed.`);
            return;
        }
    }

    sendTextResponse(res, 404, 'Not Found: Invalid route or method.');
});

server.listen(PORT, () => {
    console.log(`Student REST API Server running on http://localhost:${PORT}/`);
});
