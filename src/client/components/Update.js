import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "../styles/Profile.scss";

function Update() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const dispatch = useDispatch();

  function toMain() {
    navigate("/");
  }
  function toProfile() {
    navigate("/profile");
  }

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
      const res = await fetch("/api/updateuser", {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(res.status);
      const user = await res.json();
      // update the redux store by dispatching an action
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="card-container">
      <img
        className="round"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpaiczmKCa_Gd7MeORuu_nN7mUxR9we2h5Xc3sY-ZAjYBwhz0knH63sq77l9BM6GULDmE&usqp=CAU"
        alt="user"
      />
      <div className="nuform">
        <form ref={formRef} onSubmit={handleSubmit}>
          <label>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              onChange={handleInputChange}
            />
          </label>
          <label>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              onChange={handleInputChange}
            />
          </label>
          <label>
            <input
              type="text"
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
            />
          </label>
          <label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleInputChange}
            />
          </label>
        </form>
      </div>
      <div className="buttons">
        <button className="primary" onClick={handleSubmit}>
          Submit
        </button>
        <button className="primary ghost" onClick={toProfile}>
          Return
        </button>
      </div>
      <div className="interests">
        <h6>Interests</h6>
        <ul>
          
        </ul>
      </div>
      <div className="return">
        <button className="return" onClick={toMain}>
          Return to Chat
        </button>
      </div>
    </div>
  );
}

export default Update;
