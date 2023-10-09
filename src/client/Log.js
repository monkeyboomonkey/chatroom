import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, BrowserRouter } from "react-router-dom";
import Login from "./components/loginwindow.js";
import Signup from "./components/signupwindow.js";

function Log() {
    const navigate = useNavigate();

    return (
        <div className="login-main-window">
            <button className="bttn" onClick={() => navigate("/login")}>
                Log In
            </button>
            <button className="bttn" onClick={() => navigate("/signup")}>
                Sign Up
            </button>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </div>


    );
}


export default Log;