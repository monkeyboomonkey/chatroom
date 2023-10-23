import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setIsAuth } from "../util/chatroomReducer.ts";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const authenticateUser = () => {
        dispatch(setIsAuth(true));
        navigate("/");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loginData = {
            username: username,
            password: password
        }
        try {
            const res = await fetch('/api/userlogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData),
                credentials: 'include',
                mode: "cors",
            });
            if (res.status === 200) {
                authenticateUser();
            } else {
                throw new Error("Login failed");
            }
        } catch (error) {
            console.log(error);
            navigate("/signup");
        }
    }

    return (
        <div className="login-wrapper">
            <div className="form">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <input placeholder='Username' type="text" onChange={el => setUserName(el.target.value)} />
                    <input placeholder='Password' type="password" onChange={el => setPassword(el.target.value)} />
                    <button onClick={handleSubmit}>Log in</button>
                    <p className="message">Not registered? <Link to="/signup">Create an account</Link></p>
                </form>
            </div>
        </div>


    );
}


export default Login;