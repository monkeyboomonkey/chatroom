import React from "react";
import { useDispatch } from "react-redux";
import { setIsAuth } from "../util/chatroomReducer.ts";
import { useNavigateTo } from "./Main.jsx";

function Navbar() {
    const dispatch = useDispatch();
    const navigateTo = useNavigateTo();
    async function logoutVerifiedUser() {
        try {
            const response = await fetch("api/userlogout", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                console.log("User logged out");
                navigateTo("/login", () => {
                    dispatch(setIsAuth(false));
                });
            } else {
                throw new Error("Unknown error occurred while logging out");
            }
        } catch (err) {
            console.error(err.message);
        }
    }

    function profile() {
        navigateTo("/profile")
    }

    return (
        <nav className="navbar">
            <div className="leftNav">
                <h2>Chaxolotl</h2>
            </div>
            <div className="rightNav">
                <ul>
                    <button className="navButton" onClick={profile}>Profile</button>
                    <button className="navButton" onClick={logoutVerifiedUser}>Log Out</button>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;