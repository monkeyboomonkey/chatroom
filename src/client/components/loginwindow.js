import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";


function Login() {
    const handleSubmit = async e => {
        console.log("Login submitted")
    }
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    return (
        <div className="login-wrapper">
            {/* <h1>Login</h1> */}
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input type="text" onChange={el => setUserName(el.target.value)} />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={el => setPassword(el.target.value)} />
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>

        </div>

    )

}

export default Login;