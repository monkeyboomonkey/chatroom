import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App.js';
import { SocketContext } from './Context.js';
import { io } from "socket.io-client";

const socket = io("ws://localhost:3001");

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <SocketContext.Provider value={{ socket: socket }}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </SocketContext.Provider>
  // </React.StrictMode>
);

