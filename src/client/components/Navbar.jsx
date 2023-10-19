import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider.jsx";

function Navbar() {
    const navigate = useNavigate();
    const { logout } = useAuth();
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