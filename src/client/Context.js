import { createContext } from "react";

// Socket Context
export const SocketContext = createContext();
export const UserContext = createContext();

/* function
* takes parameter of username
* returns a socket connection
*/

export const createSocket = (username) => {
  const socket = io("ws://localhost:3001", { autoConnect: false, query: {username: username}, reconnection: false });
  return socket;
}