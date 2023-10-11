import { Server, Socket } from "socket.io";
import { createServer } from "http";
import express from "express";
import cors from "cors";
declare module "socket.io" {
  interface Socket {
    username: string;
    room: string;
  }
}
import path from "path";
import { fileURLToPath } from "url";
import { router } from "./routes/api.js";
import { errorHandler } from "./controllers/userControllers.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use(express.static(path.resolve(__dirname, "../client")));
app.use("/api", router);
app.use(errorHandler);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  /**
   * Event types:
   * Client SENDS:
   * "register" - set socket.username to provided username
   *    returns "systemMessage" with text
   * "message" - normal chat messages, default
   *    returns JSON with {user, message}
   * "joinRoom"
   *    returns "systemMessage" with text
   * "leaveRoom"
   *    returns "systemMessage" with text
   *
   * Client LISTENS:
   * "message" - a chat message in lobby or room
   * "systemMessage" - user joins or leaves room
   */

  socket.username = "anonymous";
  socket.room = "lobby";
  console.log(`a user connected with socket id: ${socket.id}`);

  /**
   * Upon connection, user will join the lobby room by default
   */
  // Join room=lobby by default
  socket.join("lobby");
  io.to("lobby").emit(
    "systemMessage",
    `${socket.id.substring(0, 2)} has joined the lobby`
  );

  /** Register username
   * Args:
   *  1. username - desired display name
   */
  socket.on("register", (username: string) => {
    socket.username = username;
    console.log(`${socket.id} changed name to ${socket.username}`);

    socket.broadcast
      .to("lobby")
      .emit("systemMessage", `${socket.username} has joined the lobby`);
  });

  /**
   * User joins a room
   * Event: "joinRoom"
   * Request args:
   *  1. user - user display name
   *  2. room - name of room to join
   */
  // front end
  // user clicks to join room
  // 1. websocket request to join room
  // 2. HTTP fetch request to api route on server, server fetches from db
  socket.on("joinRoom", (room: string) => {
    // grab last 20 messages from db for that room
    // Broadcast to room that a user has joined
    try {
      if (!room) {
        throw Error("No room provided");
      }
      // leave lobby or previous room
      socket.leave(socket.room);

      // join new room
      socket.room = room;
      console.log(`${socket.username} has joined ${room}`);
      socket.join(socket.room);

      // tell room that user has joined
      socket.broadcast
        .to(socket.room)
        .emit(
          "systemMessage",
          `socket.broadcast ${socket.username} has joined the chat`
        );
    } catch (e) {
      console.log(e.message);
    }
  });

  /**
   * Chat message
   * User sends a message to lobby or a specific room
   * Event: "message"
   * Args:
   *  1. message - text of message to send to room
   *  2. room - optional, room to send message to
   * Returns: event "message"
   * Object {
   *  username: string,
   *  message: string
   * }
   */
  socket.on("message", (message: string) => {
    // push message to a database with timestamp and room name
    console.log(`${socket.username} said ${message}`);

    const response = {
      username: socket.username,
      message: message,
    };
    // io.to should be used to send messages to all users including self
    io.to(socket.room).emit("message", response);
  });

  /**
   * Leave room
   * Event: "leaveRoom"
   * Args:
   *  1. room - name of room to leave
   */
  socket.on("leaveRoom", () => {
    socket.broadcast
      .to(socket.room)
      .emit("systemMessage", `${socket.username} has left the room`);
    socket.leave(socket.room);
  });
});

const PORT = 3001;
httpServer.listen(PORT, () =>
  console.log("listening on http://localhost:3001")
);
