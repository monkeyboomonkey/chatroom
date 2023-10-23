import { Server } from "socket.io";

export function getActiveRooms(io: Server) {
  try {
    // Convert map into 2D list:
    // ==> [['4ziBKG9XFS06NdtVAAAH', Set(1)], ['room1', Set(2)], ...]
    const arr = Array.from(io.sockets.adapter.rooms);
    /*
      Example of what the array looks like:
      [
        [ 'yrMGI-QtI4UdJ0alAAAB', Set(1) { 'yrMGI-QtI4UdJ0alAAAB' } ],
        [ 'lobby', Set(1) { 'yrMGI-QtI4UdJ0alAAAB' } ]
      ]
    */
    // Filter rooms whose name exist in set:
    // ==> [['room1', Set(2)], ['room2', Set(2)]]
    // Return only the room name: 
    // ==> ['room1', 'room2']
    const filteredActiveRooms = arr.filter(room => !room[1].has(room[0])); // filter out rooms that have more than 1 person in them
    const res = ['lobby']; // initialize res with lobby
    for (const room of filteredActiveRooms) {
      if (room[0] !== 'lobby') res.push(room[0]); // add room name to res, except for lobby
    }
    return res;
  } catch (error) {
    console.error("An error occurred getting the rooms");
    console.error(error.message);
    return [];
  }
}