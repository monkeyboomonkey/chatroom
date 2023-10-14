import React, { useState, useEffect, createContext } from "react";
import { Route, Routes, useNavigate, BrowserRouter } from "react-router-dom";
// import Login from "./components/loginwindow.js";
// import Signup from "./components/signupwindow.js";
import Chatboard from "./components/Chatboard.jsx";
import { StateContext } from "./Context.js";

function App() {
  // User object to pass as a context provider
  const [user, setUser] = useState("default");

  const navigate = useNavigate();
  function login() {
    return (window.location.href = "login.html");
  }

  return (
    <StateContext.Provider value={{ userState: [user, setUser] }}>
      <div className="loginmainwindow">
        <h1>Main Window</h1>
        <button className="btn" onClick={login}>
          Go to Login Window
        </button>
      </div>
      <Routes>
        <Route path="/" element={<Chatboard />} />
      </Routes>
    </StateContext.Provider>
  );
}

export default App;
