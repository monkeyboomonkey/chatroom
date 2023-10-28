import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setIsAuth, setUserIdentity } from "../util/chatroomReducer";
function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const authenticateUser = (userData) => {
        if (userData)
            dispatch(setUserIdentity(userData));
        dispatch(setIsAuth(true));
        navigate("/");
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const loginData = {
            username: username,
            password: password
        };
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
            }
            else {
                throw new Error("Login failed");
            }
        }
        catch (error) {
            console.log(error);
            navigate("/signup");
        }
    };
    return (React.createElement("div", { className: "outerContainer outerContainerMain" },
        React.createElement("div", { className: "login-wrapper" },
            React.createElement("div", { className: "form" },
                React.createElement("div", { className: "headersContainer" },
                    React.createElement("h1", { className: "loginHeader" }, "Chaxolotl"),
                    React.createElement("h2", { className: "loginHeader" }, "Chat with your friends!"),
                    React.createElement("h3", { className: "loginHeader" }, "Login"),
                    React.createElement("hr", null)),
                React.createElement("form", { onSubmit: handleSubmit },
                    React.createElement("input", { placeholder: 'Username', type: "text", onChange: el => setUserName(el.target.value) }),
                    React.createElement("input", { placeholder: 'Password', type: "password", onChange: el => setPassword(el.target.value) }),
                    React.createElement("button", { onClick: handleSubmit }, "Log in"),
                    React.createElement("p", { className: "message" },
                        "Not registered? ",
                        React.createElement(Link, { to: "/signup" }, "Create an account")))))));
}
export default Login;
//# sourceMappingURL=Login.js.map