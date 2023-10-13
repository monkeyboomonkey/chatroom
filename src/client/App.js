import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, Link, BrowserRouter } from "react-router-dom";
import Main from "./components/Main.js";
import Login from "./components/Login.js";
import Signup from "./components/Signup.js";
import './styles/App.scss'

function App() {
  const navigate = useNavigate();
  // checks to see if verified user exists; redirects to login page if no user exists
  const [user, setUser] = useState({});


  function login() {
    navigate("/login")
  }

  // function loginCheck() {
  //   fetch('http://localhost:3001/api/verifyuser', {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     mode: "cors",
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       if (data.user === undefined) {
  //         login()
  //       }
  //       console.log(data.user)
  //     })
  // }
  // useEffect(() => {
  //   loginCheck()
  // }, []);






  return (
    <>
      <nav>
        {/* <ul> */}
        {/* <li>
            <Link to="/">Main</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
        </ul> */}
        <span>
          <Link to="/">Main</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </span>
      </nav>
      <div className="loginmainwindow">
        <h1>BooMonkeyBoo</h1>
      </div>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login/*" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>

    </>
  )
}

export default App;