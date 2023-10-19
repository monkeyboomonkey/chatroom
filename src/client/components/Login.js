import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, Link, BrowserRouter } from "react-router-dom";
// import Login from "./Loginwindow.js";
// import Signup from "./Signup.js";
// import Main from "./Main.js";

function Log(props) {
    const navigate = useNavigate();

    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    // const [userinfo, setUserinfo] = useState({});
    const handleLogin = async (e) => {
        e.preventDefault();
        const loginData = {
            username: username,
            password: password
        }

        try {
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
                    props.setUser(newUserinfo);
                })
                .then(() => {
                    navigate("/")
                })
        } catch {
            console.log(error.message);
            navigate("/signup");
        }
    }

    return (

        <div className="login-wrapper">
            <div className="form">
                <form onSubmit={handleLogin}>
                    <label>
                        <p>Username</p>
                        <input type="text" onChange={el => setUserName(el.target.value)} />
                    </label>
                    <label>
                        <p>Password</p>
                        <input type="password" onChange={el => setPassword(el.target.value)} />
                    </label>
                    <button onClick={handleLogin}>Log in</button>
                    <p class="message">Not registered? <Link to="/signup">Create an account</Link></p>
                </form>
            </div>
        </div>


    );
}


export default Log;