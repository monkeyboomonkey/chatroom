import { createContext, useState } from "react";
import { io } from "socket.io-client";

/*
Please set the username to whatever the user's username is wether that be from a cookie or from a database or redux store.
*/
const username = "test";
// Socket Context
export const SocketContext = createContext();
export const socket = io("ws://localhost:3001", {autoConnect: false, query: {username: username}, reconnection: false});

export const UserContext = createContext();