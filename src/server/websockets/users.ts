import { Server, Socket } from "socket.io";

export async function getUsersInRoom(io: Server, socket: Socket) {
  const socketsInRoom = await io.in(socket.room).fetchSockets();
  const roster = socketsInRoom.map((s) => (s as any).username); // this loops through all socket instances in the room and returns an array of their username property
  console.log(`Current users in room ${socket.room}`);
  console.log(roster);
  return roster;
}
