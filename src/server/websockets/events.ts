import { Server, Socket } from "socket.io";
import { getUsersInRoom } from "./users.js";
import { getActiveRooms } from "./rooms.js";
import { users, chatlogs, chatrooms } from "../models/psqlmodels.js";
import { eq, lt, gte, ne } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import dotenv from 'dotenv';
const connectionString = String(process.env.POSTGRES_URI)
const client = postgres(connectionString)
const db = drizzle(client);
dotenv.config();

export function listen(io: Server) {
  /*
   * Socket.io events
   * https://socket.io/docs/v3/emitting-events/
   * https://socket.io/docs/v3/server-api/
  */
  const roomIDs = new Map<string, string>();
  io.on("connection", async (socket: Socket) => {
    /*
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

    /*
    * State Variables
    */
    socket.username = socket.handshake.query.username?.toString() || "anonymous";
    socket.room = "lobby";
    const user = await db.select().from(users).where(eq(users.username, socket.username));
    socket.userID = user[0]?.userid;

    socket.emit('rooms', getActiveRooms(io));

    socket.on("disconnect", () => {
      console.log(`user disconnected with socket id: ${socket.id}`);
      socket.disconnect(true);
    });

    /* Register username
     * Args:
     *  1. username - desired display name
    */
    socket.on("register", (username: string) => {
     socket.username = username;
      socket.broadcast
      .to("lobby")
      .emit("systemMessage", `${socket.username} has joined the lobby`);
    });

    /*
     * Start DM
     * Event: "startDM"
     * Functionality: 
     * Args:
     *  1. username - user to start DM with
    */
    socket.on("startDM", async (username: any) => {
      //* find socket that matches username
      //* io.sockets.sockets is a Map of all sockets connected to the server
      //* Array.from(io.sockets.sockets.values())[0].username) -> username of first socket in the list
      username = username.username;
      const targetSocket = Array.from(io.sockets.sockets.values()).find(
        (s) => s.username === username
      );
      if (!targetSocket) {
        //* If the target user is not found, emit an error message to the sender
        socket.emit("systemMessage", `User ${username} not found`);
        return;
      }

      //* create room name with both usernames
      let roomName = [socket.username, targetSocket.username].sort().join("-");
      roomName = `DM-${roomName}`;
      
      //* join room
      socket.leave(socket.room);
      socket.join(roomName);
      socket.room = roomName;

      targetSocket.leave(targetSocket.room);
      targetSocket.join(roomName);
      targetSocket.room = roomName;

      //* send message to room that DM has started
      io.to(roomName).emit(
        "startDM",
        { roomName, 
          users: [socket.username, targetSocket.username] } //! index zero is the initiator of the DM
      );
    });

    /*
     * User joins a room
     * Event: "joinRoom"
     * Request args:
     *  1. user - user display name
     *  2. room - name of room to join
    */
    socket.on("joinRoom", async (room: string) => {
      //* grab last 20 messages from db for that room
      //* Broadcast to room that a user has joined
      try {
        if (!room) {
          throw Error("No room provided");
        } else if (room.startsWith("DM")) {
          throw Error("Cannot join DMs through joinRoom");
        }
        //* leave lobby or previous room
        socket.leave(socket.room);
        if (socket.room !== "lobby") {
          const roster = await getUsersInRoom(io, socket);
          socket.broadcast.to(socket.room).emit("roomUsers", roster);
        }
        //* check if room exists, if not, create it
        let chatroom_id: string;
        const chatroom = await db.select().from(chatrooms).where(eq(chatrooms.chatroom_name, room)).execute();
        if (!chatroom.length) {
          const result = await db.insert(chatrooms).values({chatroom_name: room}).returning();
          chatroom_id = result[0].chatroom_id;
        } else {
          chatroom_id = chatroom[0].chatroom_id;
        }

        //* Set roomID to chatroom_id in roomIDs map
        if (!roomIDs.has(room)) roomIDs.set(room, chatroom_id); //! -> roomIDs = { 'lobby' => postgres chatroom_id }

        //* join new room
        socket.room = room;
        socket.join(socket.room);
        
        console.log("Rooms", Array.from(io.sockets.adapter.rooms.values()));
        //* tell room that user has joined
        socket.broadcast
        .to(socket.room)
        .emit(
          "systemMessage",
          {message: `${socket.username} has joined the chat`}
        );

        //* send list of connected users in room
        const roster = await getUsersInRoom(io, socket);
        io.to(socket.room).emit("roomUsers", roster);

        //* send updated list of rooms to all users as an array
        io.emit('rooms', getActiveRooms(io));
      } catch (e) {
        console.log(e.message);
      }
    });

    /*
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
    socket.on("message", async (message: {[key: string]: string}) => {
      /*
      * Check if roomID exists in roomIDs map
      * If it does, use it
      * If it doesn't, query the database for the chatroom_id
      */
      let chatroom_id: string;
      const roomID = roomIDs.get(socket.room);
      if (roomID) chatroom_id = roomID;
      else {
        const chatroom = await db.select().from(chatrooms).where(eq(chatrooms.chatroom_name, socket.room)).execute();
        chatroom_id = chatroom[0].chatroom_id;
      }

      //* insert message into chatlogs table using chatroom_id and socket.userID
      await db.insert(chatlogs).values({chatroom_id: chatroom_id, userid: socket.userID, message: message?.message})
      const response = {
        username: socket.username,
        message: message?.message,
        room: socket.room,
      };
      io.to(socket.room).emit("message", response);
    });

    /*
     * Leave room
     * Event: "leaveRoom"
     * Args:
     *  1. room - name of room to leave
    */
    socket.on("leaveRoom", async () => {
      socket.broadcast
      .to(socket.room)
      .emit("systemMessage", {message: `${socket.username} has left the chat`});
      socket.leave(socket.room);

      //* send list of connected users in room
      const roster = await getUsersInRoom(io, socket);
      io.to(socket.room).emit("roomUsers", roster);
    });
  });
}
