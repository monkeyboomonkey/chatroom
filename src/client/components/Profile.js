// import React, { useState, useEffect, useContext } from "react";
// import { Route, Routes, useNavigate } from "react-router-dom";
// import "../styles/Profile.scss";

// function Profile(props) {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState(props.user.username);
//   const [password, setPassword] = useState();
//   const [firstName, setFirstName] = useState(props.user.fn);
//   const [lastName, setLastName] = useState(props.user.ln);
//   const [email, setEmail] = useState(props.user.email);
//   const [img, setImg] = useState(
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpaiczmKCa_Gd7MeORuu_nN7mUxR9we2h5Xc3sY-ZAjYBwhz0knH63sq77l9BM6GULDmE&usqp=CAU"
//   );

//   let fullName = `${firstName} ${lastName}`;
//   let emailAddress = `${email}`;

//   function toMain() {
//     navigate("/");
//   }
//   function toUpdate() {
//     navigate("/update");
//   }

//   const handleClick = async () => {
//     console.log("testing");
//     const data = { key: "test" };

import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.scss";

function Profile() {
  const navigate = useNavigate();
  const firstName = useSelector((state) => state.chatroomReducer.fn);
  const lastName = useSelector((state) => state.chatroomReducer.ln);
  const email = useSelector((state) => state.chatroomReducer.email);

  let fullName = `${firstName} ${lastName}`;
  let emailAddress = `${email}`;

  function toMain() {
    navigate("/");
  }
  function toUpdate() {
    navigate("/update");
  }

  const handleClick = async () => {
    const presignedURL = await fetch("localhost:3001/api/getSignedURL", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const uploadedIMG = document.getElementById("image").files[0];

    await fetch(presignedURL, {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: uploadedIMG,
    });

    // post key to database
    await fetch("http://localhost:3001/api/updateuser");
  };

  return (
    <div className="card-container">
      <img
        className="round"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpaiczmKCa_Gd7MeORuu_nN7mUxR9we2h5Xc3sY-ZAjYBwhz0knH63sq77l9BM6GULDmE&usqp=CAU"
        alt="user"
      />
      <h3>{fullName}</h3>
      <h6>{emailAddress}</h6>
      <div className="buttons">
        <button className="primary" onClick={toUpdate}>
          Update
        </button>
        <button className="primary ghost" onClick={() => {}}>
          Options
        </button>
      </div>
      <div className="interests">
        <h6>Interests</h6>
        <ul></ul>
      </div>

      <div className="return">
        <button className="return" onClick={toMain}>
          Return to Chat
        </button>
      </div>
    </div>
  );
}

export default Profile;
