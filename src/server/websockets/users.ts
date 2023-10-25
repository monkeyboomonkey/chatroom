import { Server, Socket } from "socket.io";
import { users, directmessageroom } from "../models/psqlmodels.js";
import { eq, or } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import dotenv from 'dotenv';
const connectionString = String(process.env.POSTGRES_URI)
const client = postgres(connectionString)
const db = drizzle(client);
dotenv.config();

export async function getUsersInRoom(io: Server, socket: Socket) {
  const socketsInRoom = await io.in(socket.room).fetchSockets();
  const roster = socketsInRoom.map((s) => (s as any).username); // this loops through all socket instances in the room and returns an array of their username property
  console.log(`Current users in room ${socket.room}`);
  console.log(roster);
  return roster;
}

export async function findUserByUsername(username: string) {
  const user = await db.select().from(users).where(eq(users.username, username)).execute();
  return user[0];
}

export async function getUsersDirectMessageRooms(socket: Socket) {
  let dmRooms;
  try {
    if (!socket || !socket.userID) {
      throw new Error('socket or socket.userID is undefined');
    } 
    dmRooms = await db.select().from(directmessageroom).where(or(eq(directmessageroom.user1_id, socket.userID), eq(directmessageroom.user2_id, socket.userID))).execute();
    return dmRooms || [];
  } catch (e) {
    console.log(e);
    return [];
  }
}

export function getUserRooms(socket: Socket): string[] {
  return Array.from(socket.rooms).filter((r) => r !== socket.id);
}

export function getRosterAndEmit(io: Server, socket: Socket) {
  const roster = getUsersInRoom(io, socket);
  io.to(socket.room).emit("roomUsers", roster);
}

export function userHasDMRoom(socket: Socket, dmRoomName: string) {
  return socket.directMessages.has(dmRoomName);
}

export function addDMRoomToUser(socket: Socket, dmRoomName: string, dmRoomID: string) {
  socket.directMessages.set(dmRoomName, dmRoomID);
}
