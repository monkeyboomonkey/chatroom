import { createContext } from "react";
import { io, Socket } from "socket.io-client";

/* function
* takes parameter of username
* returns a socket connection
*/

// Socket Context
export const SocketContext = createContext({socket: io()});
export const UserContext = createContext({});
