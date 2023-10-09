import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";


function Login() {

    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const handleLogin = async e => {
        const loginData = {
            username: username,
            password: password
        }
        console.log(loginData)
    }

    return (
        <div className="login-wrapper">
            {/* <h1>Login</h1> */}
            <form onSubmit={handleLogin}>
                <label>
                    <p>Username</p>
                    <input type="text" onChange={el => setUserName(el.target.value)} />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={el => setPassword(el.target.value)} />
                </label>
                <div>
                    <button className="bttn" onClick={handleLogin}>Log in</button>
                </div>
            </form>

        </div>

    )

}

export default Login;