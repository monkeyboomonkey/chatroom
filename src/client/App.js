import React, { useState } from 'react';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Main from "./components/Main.js";
import Login from "./components/Login.js";
import Signup from "./components/Signup.js";
import Profile from "./components/Profile.js";
import Update from "./components/Update.js";
import './styles/App.scss'
import AuthProvider from './components/AuthProvider.jsx';
import { SocketContext, socket } from "./Context.js";
import { useDispatch } from 'react-redux';
import { userLogin } from "./chatroomReducer";
import { useSelector } from 'react-redux';

function App() {
  console.log('running App.js')

  // const dispatch = useDispatch();
  // dispatch(userLogin({fn: 'fn', ln:'ln', userid:'userid', email:'email', password:'password', username:'testusername'}));

  const initialUser = useSelector(state => state.user);
  return (
    <SocketContext.Provider value={ socket }>
      <BrowserRouter>
        <AuthProvider>
            <Routes>
              <Route path="/" element={<Main user={initialUser}/>} />
              <Route path="/login" element={<Login user={initialUser} />} />
              {/* <Route path="/" element={<Main setUser={setUser} user={user}/>} />
              <Route path="/login/*" element={<Login setUser={setUser} user={user} />} /> */}
              {/* <Route path="/signup/*" element={<Signup />} />
              <Route path="/profile/*" element={<Profile setUser={setUser} user={user} />} />
              <Route path="/update/*" element={<Update setUser={setUser} user={user} />} /> */}
            </Routes>
        </AuthProvider>
      </BrowserRouter>
    </SocketContext.Provider>
  )
}

export default App;