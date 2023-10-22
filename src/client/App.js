import React from 'react';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Main from "./components/Main.js";
import Login from "./components/Login.js";
import Signup from "./components/Signup.js";
import Profile from "./components/Profile.js";
import Update from "./components/Update.js";
import './styles/App.scss'
import AuthProvider from './components/AuthProvider.jsx';
import { SocketContext } from "./Context.js";
import { io } from "socket.io-client";
import { useSelector } from 'react-redux';
import Chatboard from './components/Chatboard.jsx';


function App() {
  const username = useSelector(state => state.username);
  const socket = io("ws://localhost:3001", { autoConnect: false, query: {username: username}, reconnection: false });
  console.log("rerendering app")
  return (
    <BrowserRouter>
        <SocketContext.Provider value={{ socket: socket }}>
              <Routes>
                <Route path="/" element={ // this is the main parent route, which will render the Main component, which renders an Outlet, which is a placeholder for the child routes of the parent route.
                  <AuthProvider>
                    <Main />
                  </AuthProvider>
                }>
                  <Route index element={ // index element is the default route for the parent route
                  <AuthProvider>
                    <Chatboard />
                  </AuthProvider>
                }/>
                  <Route path="profile" element={
                      <Profile />
                  }/>
                  <Route path="update" element={
                    <Update />
                }/>
                </Route> {/* end of main parent route */}
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
              </Routes>
        </SocketContext.Provider>
    </BrowserRouter>
  );
}

export default App;