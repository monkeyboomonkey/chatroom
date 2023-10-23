import { Server, Socket } from "socket.io";
import { getUsersInRoom } from "./users.js";
import { getActiveRooms } from "./rooms.js";

export function listen(io: Server) {
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
    * "room" - array of all current room names
    */
   console.log(`a user connected with socket id: ${socket.id}`);
   
   /**
     * State Variables
     */
    socket.username = socket.handshake.query.username?.toString() || "anonymous";
    socket.room = "lobby";

    /**
     * Upon connection, user will join the lobby room by default
     */
    // Join room=lobby by default
    io.to("lobby").emit(
      "systemMessage",
      `${socket.id.substring(0, 2)} has joined the lobby`
    );

    const activeRooms: string[] = getActiveRooms(io);
    console.log(activeRooms)
    socket.emit('rooms', activeRooms.length ? activeRooms : ['lobby']);

    socket.on("disconnect", () => {
      console.log(`user disconnected with socket id: ${socket.id}`);
      socket.disconnect(true);
    });

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
    socket.on("joinRoom", async (room: string) => {
      // grab last 20 messages from db for that room
      // Broadcast to room that a user has joined
      try {
        if (!room) {
          throw Error("No room provided");
        }
        // leave lobby or previous room
        socket.leave(socket.room);
        if (socket.room !== "lobby") {
          const roster = await getUsersInRoom(io, socket);
          socket.broadcast.to(socket.room).emit("roomUsers", roster);
        }

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

        // send list of connected users in room
        const roster = await getUsersInRoom(io, socket);
        io.to(socket.room).emit("roomUsers", roster);

        // send updated list of rooms to all users as an array
        io.emit('rooms', getActiveRooms(io));
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
    socket.on("message", (message: {[key: string]: string}) => {
      // push message to a database with timestamp and room name
      console.log(`${socket.username} sent message to ${socket.room}: ${message}`);
      const response = {
        username: socket.username,
        message: message?.message
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
    socket.on("leaveRoom", async () => {
      socket.broadcast
        .to(socket.room)
        .emit("systemMessage", `${socket.username} has left the room`);
      socket.leave(socket.room);
      // send list of connected users in room
      console.log(`${socket.username} has left ${socket.room}`);
      const roster = await getUsersInRoom(io, socket);
      io.to(socket.room).emit("roomUsers", roster);
    });
  });
}
