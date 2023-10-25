import React from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const formData = new FormData();
  const setFormData = (name, value) => {
    formData.set(name, value);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(name, value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(formData);
    try {
      await fetch("http://localhost:3001/api/registeruser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

    return (
        <div className="outerContainer outerContainerMain">
            <div className="signup-wrapper">
                <div className="form">
                    <div className="headersContainer">
                        <h1 className="loginHeader">Chaxolotl</h1>
                        <h2 className="loginHeader">Chat with your friends!</h2>
                        <h3 className="loginHeader">Signup</h3>
                        <hr />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="text"
                            name='firstName'
                            placeholder="First Name"
                            onChange={handleInputChange}
                        />
                        <input 
                            type="text" 
                            name='lastName'
                            placeholder="Last Name"
                            onChange={handleInputChange}
                        />
                        <input 
                            type="text" 
                            name='email'
                            placeholder="Email"
                            onChange={handleInputChange}
                        />
                        <input 
                            type="text" 
                            name='username'
                            placeholder="Username"
                            onChange={handleInputChange}
                        />
                        <input 
                            type="password" 
                            name='password'
                            placeholder="Password"
                            onChange={handleInputChange}
                        />
                        <button onClick={handleSubmit}>Submit</button>
                        <p className="message">Already registered? <Link to="/login">Sign in</Link></p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;
