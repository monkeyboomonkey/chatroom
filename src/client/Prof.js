import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, BrowserRouter } from "react-router-dom";
import Login from "./components/Loginwindow.js";
import Signup from "./components/Signupwindow.js";

function Profile() {
    const navigate = useNavigate();

    return (
        <div className="login-main-window">
            <div className="button-window">
                <button className="bttn" onClick={() => navigate("/login")}>
                    Update
                </button>
                <button className="bttn" onClick={() => navigate("/signup")}>
                    Delete
                </button>
            </div>
            <div className="routes-window">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Routes>
            </div>

        </div>


    );
}


export default Profile;