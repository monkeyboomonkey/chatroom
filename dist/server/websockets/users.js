import { users, directmessageroom } from "../models/psqlmodels.js";
import { eq, or } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';
const connectionString = String(process.env.POSTGRES_URI);
const client = postgres(connectionString);
const db = drizzle(client);
dotenv.config();
export async function getUsersInRoom(io, socket) {
    const socketsInRoom = await io.in(socket.room).fetchSockets();
    const roster = socketsInRoom.map((s) => s.username); // this loops through all socket instances in the room and returns an array of their username property
    console.log(`Current users in room ${socket.room}`);
    console.log(roster);
    return roster;
}
/**
 *
 * @param username Username of user to find in Database
 * @returns User object from database
 */
export async function findUserByUsername(username) {
    const user = await db.select().from(users).where(eq(users.username, username)).execute();
    return user[0];
}
export async function getUsersDirectMessageRooms(socket) {
    let dmRooms;
    try {
        if (!socket || !socket.userID) {
            throw new Error('socket or socket.userID is undefined');
        }
        dmRooms = await db.select().from(directmessageroom).where(or(eq(directmessageroom.user1_id, socket.userID), eq(directmessageroom.user2_id, socket.userID))).execute();
        return dmRooms || [];
    }
    catch (e) {
        console.log(e);
        return [];
    }
}
export function getUserRooms(socket) {
    return Array.from(socket.rooms).filter((r) => r !== socket.id);
}
export function getRosterAndEmit(io, socket) {
    const roster = getUsersInRoom(io, socket);
    io.to(socket.room).emit("roomUsers", roster);
}
export function userHasDMRoom(socket, dmRoomName) {
    return socket.directMessages.has(dmRoomName);
}
export function addDMRoomToUser(socket, dmRoomName, dmRoomID) {
    socket.directMessages.set(dmRoomName, dmRoomID);
}
//# sourceMappingURL=users.js.map