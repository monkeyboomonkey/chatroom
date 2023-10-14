import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, Link, BrowserRouter } from "react-router-dom";
// import Login from "./components/loginwindow.js";
// import Signup from "./components/signupwindow.js";
import Chatboard from "./Chatboard.jsx";
import Login from "./Login.js";
import Signup from "./Signup.js";
import Profile from "./Profile.js";
import Update from "./Update.js";

function Main() {
    const navigate = useNavigate();
    // checks to see if verified user exists; redirects to login page if no user exists
    // const [user, setUser] = useState({});

    // function loginCheck() {
    //     fetch('http://localhost:3001/api/verifyuser', {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         mode: "cors",
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             if (data.user !== undefined) {
    //                 login()
    //             }
    //             console.log(data.user)
    //         })
    // }
    // useEffect(() => {
    //     loginCheck()
    // }, []);

    // // "routes" to redirect users
    function login() {
        navigate("/login")
    }

    // useEffect(() => {
    //     console.log("Running useeffect")
    //     fetch('http://localhost:3001/api/verifyuser', {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         mode: "cors",
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             if (data.user === undefined) {
    //                 navigate("/login")
    //             }
    //             console.log(data.user)
    //         })
    // }, [navigate]);


    return (
        <div>
            <nav>
                <span>
                    <Link to="/">Main</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Sign Up</Link>
                    <Link to="/profile">Profile</Link>
                    <Link to="/update">Update</Link>
                </span>
            </nav>
            <Routes>
                <Route path="/" element={<Chatboard />} />
                <Route path="/login/*" element={<Login />} />
                <Route path="/signup/*" element={<Signup />} />
                <Route path="/profile/*" element={<Profile />} />
                <Route path="/update/*" element={<Update />} />
            </Routes>
        </div>
    )
}

export default Main;