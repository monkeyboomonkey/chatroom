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
import { useDispatch } from 'react-redux';
import { userLogin } from "./chatroomReducer";

function App() {
  console.log('running App.js')
  // // test dispatch functionality

  // const dispatch = useDispatch();
  // dispatch(userLogin({fn: 'fn', ln:'ln', userid:'userid', email:'email', password:'password', username:'testusername'}));

  const [user, setUser] = useState({});
  // const userValues = [user, setUser]

  return (
    <SocketContext.Provider value={ socket }>
      <BrowserRouter>
        <AuthProvider>
          {/* <UserContext.Provider value={userValues}> */}
            <Routes>
              <Route path="/" element={<Main setUser={setUser} user={user}/>} />
              <Route path="/login/*" element={<Login setUser={setUser} user={user} />} />
              <Route path="/signup/*" element={<Signup />} />
              <Route path="/profile/*" element={<Profile setUser={setUser} user={user} />} />
              <Route path="/update/*" element={<Update setUser={setUser} user={user} />} />
            </Routes>
          {/* </UserContext.Provider> */}
        </AuthProvider>
      </BrowserRouter>
    </SocketContext.Provider>
  )
}

export default App;