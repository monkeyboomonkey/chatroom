import { Server, Socket } from "socket.io";
import { getUsersInRoom, getUsersDirectMessageRooms, findUserByUsername } from "./users.js";
import { handleChatRoomJoin, handleDMRoomJoin, handleStartDM } from "./rooms.js";
import { chatrooms } from "../models/psqlmodels.js";

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';
import { handleChatMessage, handleDMMessage } from "./messages.js";
const connectionString = String(process.env.POSTGRES_URI);
const client = postgres(connectionString);
const db = drizzle(client);
dotenv.config();



export async function init(io: Server) {
  /*
  * Socket.io events
  * https://socket.io/docs/v3/emitting-events/
  * https://socket.io/docs/v3/server-api/
  */

  //* Get all rooms from database
  let allRooms: any[] = await db.select().from(chatrooms).execute();

  //* Map of room names to chatroom_ids  
  //? Refactored to use only one loop to get all rooms without DMs and roomIDs into a map, this is more efficient
  const roomIDs: Map<string, string> = new Map<string, string>();
  allRooms = allRooms.reduce((rooms: string[], room: any) => {
    roomIDs.set(room.chatroom_name, room.chatroom_id); //! add room to roomIDs map
    if (!room.chatroom_name.startsWith('DM')) rooms.push(room.chatroom_name); //! add room to rooms array, if it's not a DM room
    return rooms;
  }, []);
  
  //* Array of all room names (except DM rooms)
  // allRooms = allRooms.map((room: any) => {
  //   return room.chatroom_name
  // }).filter((room: any) => {
  //   return !room.startsWith('DM')
  // });

  //* Add lobby to allRooms array
  if (!allRooms.includes("lobby")) allRooms.push("lobby"); //! add lobby to allRooms array, if it doesn't exist
  
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
    console.log('All Rooms', allRooms)
  
    /*
    * State Variables
    */
    socket.username = socket.handshake.query.username?.toString() || "anonymous"; //* default username is anonymous
    const user = await findUserByUsername(socket.username); //* get user from database

    if (user?.pictureURL) {
      socket.userProfilePic = user.pictureURL;
    }
    socket.userID = user?.userid; //* set socket.userID to user's id from database
    socket.room = "lobby"; //* default room is lobby, room is always a string

    socket.directMessages = new Map<string, string>; //* Map of DM rooms, key = room name, value = directmessageroom_id
    //* get all DM rooms for user from database
    (await getUsersDirectMessageRooms(socket)).forEach((room: any) => {
      //! add DM rooms to socket.directMessages map
      socket.directMessages.set(room.directmessageroom_name, room.directmessageroom_id);
    });

    //? send list of ACTIVE rooms to user
    // socket.emit('rooms', getActiveRooms(io)); //! dangerous, this will send ALL rooms to the user, including DM rooms

    //* send list of ALL rooms to user
    socket.emit('rooms', allRooms.concat(Array.from(socket.directMessages.keys())));

    //* On disconnect, remove user from all rooms
    socket.on("disconnect", () => {
      console.log(`user disconnected with socket id: ${socket.id}`);
      socket.disconnect(true);
    });

    /* Register username
    * Args:
    * 1. username - desired display name
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
      //* pass username.username
      await handleStartDM(username.username, io, socket);
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
        }
        if (room.startsWith('DM')) { //? if room is a DM room
          //* check if roomID exists in socket.directMessages map
          console.log('DM room', room);
          await handleDMRoomJoin(io, socket, room);
        } else {
          await handleChatRoomJoin(io, socket, room, roomIDs, allRooms);
        }

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
    socket.on("message", async (message: {[key: string]: string | ArrayBuffer}) => {
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
      if (socket.room.startsWith('DM')) { //! if room is a DM room
        await handleDMMessage(io, socket, message);
      } else { //! if room is a chatroom
        await handleChatMessage(io, socket, message, roomIDs);
      }
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
