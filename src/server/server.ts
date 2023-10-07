import { Server } from "socket.io";
import { createServer } from "http";
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { router } from './routes/api.js';
import { errorHandler } from './controllers/userControllers.js';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.resolve(__dirname, '../client')));
app.use('/api', router);
app.use(errorHandler);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {origin: "*"}
});

io.on('connection', (socket) => {
    console.log(`a user connected with socket id: ${socket.id}`);

    socket.on('message', (message) =>     {
        console.log(message);
        io.emit('message', `${socket.id.substr(0,2)} said ${message}` );   
    });
});

const PORT = 3001;
httpServer.listen(PORT, () => console.log('listening on http://localhost:3001') );
