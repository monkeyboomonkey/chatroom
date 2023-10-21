import React, { useState } from 'react';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Main from "./components/Main.js";
import Login from "./components/Login.js";
import Signup from "./components/Signup.js";
import Profile from "./components/Profile.js";
import Update from "./components/Update.js";
import './styles/App.scss'
import { UserContext } from './Context.js';
import AuthProvider from './components/AuthProvider.jsx';
import { SocketContext, socket } from "./Context.js";

function App() {
  const [user, setUser] = useState({});
  const userValues = [user, setUser]
  const socket = io("ws://localhost:3001", { autoConnect: false, query: {username: username}, reconnection: false });
  console.log("rerendering app")
  return (
    <BrowserRouter>
        <SocketContext.Provider value={{ socket: socket }}>
          <AuthProvider>
            <UserContext.Provider value={userValues}>
              <Routes>
                <Route path="/login/*" element={<Login />} />
                <Route path="/signup/*" element={<Signup />} />
                <Route path="/" element={<Main />} />
                <Route path="/profile/*" element={<Profile />} />
                <Route path="/update/*" element={<Update />} />
              </Routes>
            </UserContext.Provider>
          </AuthProvider>
        </SocketContext.Provider>
    </BrowserRouter>
  );
}

export default App;