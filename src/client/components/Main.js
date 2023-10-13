import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, Link, BrowserRouter } from "react-router-dom";
// import Login from "./components/loginwindow.js";
// import Signup from "./components/signupwindow.js";
import Chatboard from "./Chatboard.jsx";
import Login from "./Login.js";

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


    return (
        <>

            <div className="loginmainwindow">
                <button className="btn" onClick={login}>Go to Login Window</button>
                {/* <button className="btn" onClick={loginCheck}>Check</button> */}
            </div>
            <Routes>
                <Route path="/" element={<Chatboard />} />
                <Route path="/login" element={<Login />} />
            </Routes>

        </>
    )
}

export default Main;