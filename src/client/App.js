import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, BrowserRouter } from "react-router-dom";
// import Login from "./components/loginwindow.js";
// import Signup from "./components/signupwindow.js";
import Chatboard from './components/Chatboard.jsx';

function App() {
  const navigate = useNavigate();
  // checks to see if verified user exists; redirects to login page if no user exists
  function loginCheck() {
    fetch('http://localhost:3001/api/verifyuser', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: "cors",
    })
      .then(response => response.json())
      .then(data => {
        if (data.user === undefined) login()
        console.log(data.user)
      })
  }
  useEffect(() => {
    loginCheck()
  }, []);

  // "routes" to redirect users
  function login() {
    return window.location.href = "login.html"
  }
  function profile() {
    return window.location.href = "profile.html"
  }

  return (
    <>
      <div className="loginmainwindow">
        <h1>Main Window</h1>
        <button className="btn" onClick={login}>Go to Login Window</button>
        <button className="btn" onClick={loginCheck}>Check</button>
        <button className="btn" onClick={profile}>Go to Profile</button>
      </div>
      <Routes>
        <Route path="/" element={<Chatboard />} />
      </Routes>
    </>
  )
}

export default App;