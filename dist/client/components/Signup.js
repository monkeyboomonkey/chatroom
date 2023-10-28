import React from "react";
import { useNavigate, Link } from "react-router-dom";
function Signup() {
    const navigate = useNavigate();
    const formData = new FormData();
    const setFormData = (name, value) => {
        formData.set(name, value);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.currentTarget;
        setFormData(name, value);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(formData);
        try {
            await fetch("api/registeruser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            navigate("/login");
        }
        catch (error) {
            console.log(error.message);
        }
    };
    return (React.createElement("div", { className: "outerContainer outerContainerMain" },
        React.createElement("div", { className: "signup-wrapper" },
            React.createElement("div", { className: "form" },
                React.createElement("div", { className: "headersContainer" },
                    React.createElement("h1", { className: "loginHeader" }, "Chaxolotl"),
                    React.createElement("h2", { className: "loginHeader" }, "Chat with your friends!"),
                    React.createElement("h3", { className: "loginHeader" }, "Signup"),
                    React.createElement("hr", null)),
                React.createElement("form", { onSubmit: handleSubmit },
                    React.createElement("input", { type: "text", name: 'firstName', placeholder: "First Name", onChange: handleInputChange }),
                    React.createElement("input", { type: "text", name: 'lastName', placeholder: "Last Name", onChange: handleInputChange }),
                    React.createElement("input", { type: "text", name: 'email', placeholder: "Email", onChange: handleInputChange }),
                    React.createElement("input", { type: "text", name: 'username', placeholder: "Username", onChange: handleInputChange }),
                    React.createElement("input", { type: "password", name: 'password', placeholder: "Password", onChange: handleInputChange }),
                    React.createElement("button", { onClick: handleSubmit }, "Submit"),
                    React.createElement("p", { className: "message" },
                        "Already registered? ",
                        React.createElement(Link, { to: "/login" }, "Sign in")))))));
}
export default Signup;
//# sourceMappingURL=Signup.js.map