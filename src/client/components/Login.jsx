import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setIsAuth, setUserIdentity } from "../util/chatroomReducer.ts";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const authenticateUser = (userData) => {
      if (userData) dispatch(setUserIdentity(userData));
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
      const userData = await res.json();
      if (res.status === 200) {
        authenticateUser(userData);
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.log(error);
      navigate("/signup");
    }
  }

  return (
    <div className="outerContainer outerContainerMain">
      <div className="login-wrapper">
        <div className="form">
          <div className="headersContainer">
            <h1 className="loginHeader">Chaxolotl</h1>
            <h2 className="loginHeader">Chat with your friends!</h2>
            <h3 className="loginHeader">Login</h3>
            <hr/>
          </div>
          <form onSubmit={handleSubmit}>
              <input placeholder='Username' type="text" onChange={el => setUserName(el.target.value)} />
              <input placeholder='Password' type="password" onChange={el => setPassword(el.target.value)} />
              <button onClick={handleSubmit}>Log in</button>
              <p className="message">Not registered? <Link to="/signup">Create an account</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
}


export default Login;
