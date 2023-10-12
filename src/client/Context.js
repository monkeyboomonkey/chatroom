import { createContext } from "react";
import { io } from "socket.io-client";

// Socket Context
export const SocketContext = createContext();
export const socket = io("ws://localhost:3001");