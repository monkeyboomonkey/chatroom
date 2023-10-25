import { Server, Socket } from "socket.io";
import { users, directmessageroom, directmessages } from "../models/psqlmodels.js";
import { eq, lt, gte, ne, or } from "drizzle-orm";
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
  const dmRooms = await db.select().from(directmessageroom).where(or(eq(directmessageroom.user1_id, socket.userID), eq(directmessageroom.user2_id, socket.userID))).execute();
  return dmRooms;
}