import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, BrowserRouter } from "react-router-dom";
import Login from "./components/loginwindow.js";
import Signup from "./components/signupwindow.js";

function App() {
    const navigate = useNavigate();
    function login() {

        return window.location.href = "login.html"
    }
    return (

        <div className="loginmainwindow">
            <h1>Main Window</h1>
            <button className="btn" onClick={login}>Go to Login Window</button>
        </div>

    );
}


export default App;