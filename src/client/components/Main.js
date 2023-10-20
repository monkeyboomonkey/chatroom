import React, { useEffect } from 'react';
import Chatboard from "./Chatboard.jsx";
import { useNavigate } from "react-router-dom";

function Main({ user }) {
    const navigate = useNavigate();
    useEffect(() => {
        console.log("Main rerendered")
        fetch('http://localhost:3001/api/verify', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: "cors",
        })
        .then(response => response.json())
        .then(data => {
            console.log("Verification response is: " + data)
            if (data !== true) {
                localStorage.removeItem("authStatus");
                navigate("/login")
            }
        });
    }, [])
    return (
        <div>
            <Chatboard user={user} />
        </div>
    )
}

export default Main;