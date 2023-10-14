import React, { useState, useEffect } from "react";
import {
  Route,
  Routes,
  useNavigate,
  Link,
  BrowserRouter,
} from "react-router-dom";
import Main from "./components/Main.js";
import Login from "./components/Login.js";
import Signup from "./components/Signup.js";
import Profile from "./components/Profile.js";
import Update from "./components/Update.js";
import "./styles/App.scss";

function App() {
  // User object to pass as a context provider
  const [user, setUser] = useState("default");

  const navigate = useNavigate();
  // checks to see if verified user exists; redirects to login page if no user exists

  function login() {
    navigate("/login");
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
    <div
    // style={{ backgroundImage: `url("https://gifdb.com/images/high/aesthetic-anime-pixelated-background-bnuuk8wf00lrrcvf.gif")`}}
    >
      <Routes>
        <Route path="/" element={<Main />} />
        <Route
          path="/login/*"
          element={<Login setUser={setUser} user={user} />}
        />
        <Route path="/signup/*" element={<Signup />} />
        <Route
          path="/profile/*"
          element={<Profile setUser={setUser} user={user} />}
        />
        <Route
          path="/update/*"
          element={<Update setUser={setUser} user={user} />}
        />
      </Routes>
    </div>
  );
}

export default App;
