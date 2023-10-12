import React, { useState, useEffect, createContext } from 'react';
import { Route, Routes, useNavigate, BrowserRouter } from "react-router-dom";
// import Login from "./components/loginwindow.js";
// import Signup from "./components/signupwindow.js";
import Chatboard from './components/Chatboard.jsx';
import { SocketContext } from './Context.js';
import { io } from "socket.io-client";

const socket = io("ws://localhost:3001");

function App() {
  const navigate = useNavigate();
    function login() {
        return window.location.href = "login.html"
    }
  

  return (
    <SocketContext.Provider value={{ socket: socket }}>
      <div className="loginmainwindow">
          <h1>Main Window</h1>
          <button className="btn" onClick={login}>Go to Login Window</button>
      </div>
      <Routes>
        <Route path="/" element={<Chatboard/>} />
      </Routes>
    </SocketContext.Provider>
  )
}

export default App;