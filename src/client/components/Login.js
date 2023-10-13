import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, Link, BrowserRouter } from "react-router-dom";
// import Login from "./Loginwindow.js";
import Signup from "./Signup.js";
import Main from "./Main.js";

function Log() {
    const navigate = useNavigate();

    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [userinfo, setUserinfo] = useState({});
    const handleLogin = async (e) => {
        e.preventDefault();
        const loginData = {
            username: username,
            password: password
        }

        fetch('http://localhost:3001/api/userlogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData),
            credentials: 'include',
            mode: "cors",

        })
            .then(response => response.json())
            .then(data => {
                const newUserinfo = { ...data }
                setUserinfo(newUserinfo);
            })
    }

    function signup() {
        navigate("/signup")
    }

    return (

        <div className="login-main-window">
            <div className="login-wrapper">
                <form onSubmit={handleLogin}>
                    <label>
                        <p>Username</p>
                        <input type="text" onChange={el => setUserName(el.target.value)} />
                    </label>
                    <label>
                        <p>Password</p>
                        <input type="password" onChange={el => setPassword(el.target.value)} />
                    </label>
                    <span>
                        <button className="bttn" onClick={handleLogin}>Log in</button>
                        <button className="bttn" onClick={signup}>Sign up</button>
                    </span>
                </form>
            </div>
            <div className="routes-window">
                <Routes>
                    <Route path="/signup" element={<Signup />} />
                </Routes>
            </div>

        </div>


    );
}


export default Log;