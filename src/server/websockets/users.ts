import { Server, Socket } from "socket.io";

export async function getUsersInRoom(io: Server, socket: Socket) {
  const socketsInRoom = await io.in(socket.room).fetchSockets();
  const roster = socketsInRoom.map((s) => (s as any).username);
  console.log(`Current users in room ${socket.room}`);
  console.log(roster);
  return roster;
}
