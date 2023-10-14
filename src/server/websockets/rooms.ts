import { Server, Socket } from "socket.io";

export function getActiveRooms(io: Server) {
  try {
    // Convert map into 2D list:
    // ==> [['4ziBKG9XFS06NdtVAAAH', Set(1)], ['room1', Set(2)], ...]
    const arr = Array.from(io.sockets.adapter.rooms);
    // Filter rooms whose name exist in set:
    // ==> [['room1', Set(2)], ['room2', Set(2)]]
    // Return only the room name:
    // ==> ['room1', 'room2']
    const res = arr.filter((room) => !room[1].has(room[0])).map((i) => i[0]);
    const testRes = arr.filter((room) => !room[1].has(room[0]));
    console.log("getActiveRooms");
    console.log(testRes);
    return res;
  } catch (error) {
    console.error("An error occurred getting the rooms");
    console.error(error.message);
  }
}
