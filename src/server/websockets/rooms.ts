import { Server, Socket } from "socket.io";
import { eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/postgres-js'
import { getRosterAndEmit, getUsersInRoom, findUserByUsername, userHasDMRoom, addDMRoomToUser } from "./users.js";
import { chatrooms, directmessageroom } from "../models/psqlmodels.js";
import postgres from 'postgres'
import dotenv from 'dotenv'
const connectionString = String(process.env.POSTGRES_URI)
const client = postgres(connectionString)
const db = drizzle(client);
dotenv.config();

export function getActiveRooms(io: Server) {
  try {
    const arr = Array.from(io.sockets.adapter.rooms);
    /*
    *  Example of what the array looks like:
    *  [
    *    [ 'yrMGI-QtI4UdJ0alAAAB', Set(1) { 'yrMGI-QtI4UdJ0alAAAB' } ],
    *    [ 'lobby', Set(1) { 'yrMGI-QtI4UdJ0alAAAB' } ]
    *  ]
    */
    const filteredActiveRooms = arr.filter(room => !room[1].has(room[0]));
    const res = ['lobby']; //* initialize res with lobby

    for (const room of filteredActiveRooms) {
      if (room[0] !== 'lobby' && !room[0].startsWith('DM')) res.push(room[0]); //* add room to res if it's not lobby or a DM room
    }

    return res;
  } catch (error) {
    console.error("An error occurred getting the rooms");
    console.error(error.message);
    return [];
  }
}

/**
 * 
 * @param roomName chatroom name to search for
 * @returns the chatroom
 */
export async function chatRoomExists(roomName: string) {
  const result = await db.select().from(chatrooms).where(eq(chatrooms.chatroom_name, roomName));
  return result[0];
}

/**
 * @param directMessageRoomName the name of the direct message room to search for
 * @returns the direct message room
 */
export async function directMessageRoomExists(directMessageRoomName: string) {
  const result = await db.select()
  .from(directmessageroom)
  .where(eq(directmessageroom.directmessageroom_name, directMessageRoomName));
  return result[0];
}

/**
 * @param roomName the name of the room to insert into the database
 * @returns array with chatroom object that was inserted into the database
 */
export async function insertChatRoom(roomName: string) {
  try {
    const result = await db.insert(chatrooms)
    .values({ chatroom_name: roomName })
    .onConflictDoNothing()
    .returning();
    return result;
  } catch (e) {
    console.log(e);
    return [];
  }
}

/**
 * @param directMessageRoomName the name of the direct message room to insert into the database
 * @returns array with the direct message room object that was inserted into the database
*/
export async function insertDirectMessageRoom(directMessageRoomName: string, user1_id: string, user2_id: string) {
  try {
    const result = await db.insert(directmessageroom)
    .values({ directmessageroom_name: directMessageRoomName, user1_id: user1_id, user2_id: user2_id })
    .onConflictDoNothing()
    .returning();
    return result;
  } catch (e) {
    console.log(e);
    return [];
  }
}

/**
 * ASYNC FUNCTION
 * @param io Server object
 * @param socket Current socket
 * @param room Room to join
 * @returns Promise<void>
 */
export async function handleDMRoomJoin(io: Server, socket: Socket, room: string) {
  const roomID = socket.directMessages.get(room);
  if (roomID) { //* if it does, use it
    socket.room = room;
    socket.join(socket.room);
    getRosterAndEmit(io, socket);
    return;
  } else { //* if it doesn't, query the database for the directmessageroom_id
    const dmRoom = await directMessageRoomExists(room);
    if (!dmRoom) throw Error("DM room not found");
    socket.directMessages.set(room, dmRoom.directmessageroom_id); //! add DM room to socket.directMessages map
    socket.room = room;
    socket.join(socket.room);
    getRosterAndEmit(io, socket);
    return;
  }
}

/**
 * ASYNC FUNCTION
 * @param io Server object
 * @param socket Current socket
 * @param room Room to join
 * @param roomIDs Current map of room names to roomIDs
 * @param allRooms Current array of all rooms
 * @returns Promise<void>
 */
export async function handleChatRoomJoin(io: Server, socket: Socket, room: string, roomIDs: Map<string, string>, allRooms: string[]) {
  //* leave lobby or previous room
  socket.leave(socket.room);
  if (socket.room !== "lobby") {
    const roster = await getUsersInRoom(io, socket);
    socket.broadcast.to(socket.room).emit("roomUsers", roster);
  }
  
  //* check if room exists, if not, create it
  let chatroom_id: string;
  let chatroom = await chatRoomExists(room);
  if (!chatroom) {
    const result = await insertChatRoom(room);
    chatroom_id = result[0].chatroom_id;
  } else {
    chatroom_id = chatroom.chatroom_id;
  }
  
  //* Set roomID to chatroom_id in roomIDs map
  if (!roomIDs.has(room)) roomIDs.set(room, chatroom_id); //! -> roomIDs = { 'lobby' => postgres chatroom_id }
  if (!allRooms.includes(room)) allRooms.push(room); //! add room to allRooms array, if it doesn't exist
  
  //* join new room
  socket.room = room;
  socket.join(socket.room);
  
  //* tell room that user has joined, if room is not a DM room
  if (!room.startsWith('DM')) {       
    io.to(room)
    .emit(
      "systemMessage",
      {message: `${socket.username} has joined the chat`}
    );
  }

  //* send updated list of rooms to all users as an array
  io.emit('rooms', allRooms.concat(Array.from(socket.directMessages.keys())));

  //* send list of connected users in room
  getRosterAndEmit(io, socket);
}

/**
 * ASYNC FUNCTION
 * @param username target user to start DM with
 * @param io Server object
 * @param socket Current socket
 * @returns Promise<void>
 */
export async function handleStartDM(username: string, io: Server, socket: Socket) {
  //* find socket that matches username
  //* io.sockets.sockets is a Map of all sockets connected to the server
  //* Array.from(io.sockets.sockets.values())[0].username) -> username of first socket in the list
  username = username;
  const targetSocket = Array.from(io.sockets.sockets.values()).find(
    (s) => s.username === username
  );

  if (!targetSocket) {
    //* If the target user is not found, emit an error message to the sender
    socket.emit("systemMessage", {message: `User ${username} not found`});
    return;
  }
  //* insert DM room into directmessages table
  const user2_id = (await findUserByUsername(username)).userid;
  const user1_id = socket.userID;
  let directmessageroom_name = [socket.username, targetSocket.username].sort().join('-'); //! create DM room name from usernames, sorted alphabetically];
    
  directmessageroom_name = `DM-${directmessageroom_name}`;
  if (userHasDMRoom(socket, directmessageroom_name) || userHasDMRoom(targetSocket, directmessageroom_name)) {
    socket.emit("systemMessage", {message: `DM room already exists`});
    return;
  }

  const result = await insertDirectMessageRoom(directmessageroom_name, user1_id, user2_id);
  console.log("result:", result)

  addDMRoomToUser(socket, directmessageroom_name, result[0].directmessageroom_id) //! add DM room to socket.directMessages map
  addDMRoomToUser(targetSocket, directmessageroom_name, result[0].directmessageroom_id) //! add DM room to targetSocket.directMessages map

  //* join DM room
  socket.join(directmessageroom_name);
  targetSocket.join(directmessageroom_name);
  io.to(directmessageroom_name).emit("singleRoom", directmessageroom_name); //! add DM room to allRooms array
  io.to(targetSocket.id).emit("systemMessage", {message: `${socket.username} started a DM with you`});
}
