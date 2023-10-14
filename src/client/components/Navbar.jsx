import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const logout = () => {
        fetch('http://localhost:3001/api/userlogout', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: "cors",
        })
        login()
    }

    function login() {
        navigate("/login")
    }
    function profile() {
        navigate("/profile")
    }




    return (
        <nav className="navbar">
            <div className="leftNav">
                <h2>Chaxolotl</h2>
            </div>
            <div className="rightNav">
                <ul>
                    <button className="navButton" onClick={profile}>Profile</button>
                    <button className="navButton" onClick={logout}>Log Out</button>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;