import { createContext, useState } from "react";
import { io } from "socket.io-client";

// Socket Context
export const SocketContext = createContext();
export const socket = io("ws://localhost:3001");

console.log("*******Socket initialized from Context*******");

// User Context
export const StateContext = createContext();
