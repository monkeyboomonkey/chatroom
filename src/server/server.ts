import { Server } from "socket.io";
import { createServer } from "http";
import express from 'express';

const app = express();
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
