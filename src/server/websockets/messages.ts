import { Server, Socket } from "socket.io";
import { directmessageroom, chatlogs, directmessages } from "../models/psqlmodels.js";
import { chatRoomExists, directMessageRoomExists } from "./rooms.ts";
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import dotenv from 'dotenv';
const connectionString = String(process.env.POSTGRES_URI)
const client = postgres(connectionString)
const db = drizzle(client);
dotenv.config();

export async function insertChatRoomMessage(socket: Socket, message: any, chatroom_id: string) {
  await db.insert(chatlogs)
  .values({chatroom_id: chatroom_id, userid: socket.userID, message: message?.message})
  .onConflictDoNothing();
}

export async function insertDirectMessage(socket: Socket, message: any, directmessageroom_id: string) {
  await db.insert(directmessages)
  .values({directmessageroom_id: directmessageroom_id, userid: socket.userID, message: message?.message})
  .onConflictDoNothing();
}

export async function handleDMMessage(io: Server, socket: Socket, message: any) {
  let directmessageroom_id: string;
  const roomID = socket.directMessages.get(socket.room); //* check if roomID exists in socket.directMessages map
  if (roomID) directmessageroom_id = roomID; //* if it does, use it
  else { //* if it doesn't, query the database for the directmessageroom_id
    const dmRoom = await directMessageRoomExists(socket.room);
    directmessageroom_id = dmRoom.directmessageroom_id;
  }

  //* insert message into directmessages table using chatroom_id and socket.userID
  await insertDirectMessage(socket, message, directmessageroom_id);

  const response = {
    username: socket.username,
    message: message?.message,
    room: socket.room,
  };
  io.to(socket.room).emit("message", response);
}

export async function handleChatMessage(io: Server, socket: Socket, message: any, roomIDs: Map<string, string>) {
  let chatroom_id: string;
  const roomID = roomIDs.get(socket.room);
  if (roomID) chatroom_id = roomID;
  else {
    const chatroom = await chatRoomExists(socket.room);
    chatroom_id = chatroom.chatroom_id;
  }
  
  //* insert message into chatlogs table using chatroom_id and socket.userID
  await insertChatRoomMessage(socket, message, chatroom_id);

  const response = {
    username: socket.username,
    message: message?.message,
    room: socket.room,
  };
  io.to(socket.room).emit("message", response);
}
