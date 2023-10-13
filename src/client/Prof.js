import React, { useState, useEffect, useContext } from 'react';
import { Route, Routes, useNavigate, BrowserRouter } from "react-router-dom";
import Login from "./components/Loginwindow.js";
import Update from "./components/Profilewindow.js";

function Profile() {
    const navigate = useNavigate();

    return (

        <div className="login-main-window">
            <div className="button-window">
                <button className="bttn" onClick={() => navigate("/login")}>
                    Nvm
                </button>
                <button className="bttn" onClick={() => navigate("/update")}>
                    Update
                </button>
            </div>
            <div className="routes-window">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/update" element={<Update />} />
                </Routes>
            </div>

        </div>


    );
}


export default Profile;