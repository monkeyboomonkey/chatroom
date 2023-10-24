import React, { useState, useEffect, useContext } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "../styles/Profile.scss";

function Profile(props) {
  const navigate = useNavigate();
  const [username, setUsername] = useState(props.user.username);
  const [password, setPassword] = useState();
  const [firstName, setFirstName] = useState(props.user.fn);
  const [lastName, setLastName] = useState(props.user.ln);
  const [email, setEmail] = useState(props.user.email);
  const [img, setImg] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpaiczmKCa_Gd7MeORuu_nN7mUxR9we2h5Xc3sY-ZAjYBwhz0knH63sq77l9BM6GULDmE&usqp=CAU"
  );

  let fullName = `${firstName} ${lastName}`;
  let emailAddress = `${email}`;

  function toMain() {
    navigate("/");
  }
  function toUpdate() {
    navigate("/update");
  }

  const handleClick = async () => {
    console.log("testing");
    const data = { key: "test" };

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
    <div class="card-container">
      <img class="round" src={img} alt="user" id="image" />

      <input type="file" />
      <button onClick={handleClick}>upload</button>

      <h3>{fullName}</h3>
      <h6>{emailAddress}</h6>
      <div class="buttons">
        <button class="primary" onClick={toUpdate}>
          Update
        </button>
        <button class="primary ghost">Options</button>
      </div>
      <div class="interests">
        <h6>Interests</h6>
        <ul>
          <li>UI / UX</li>
          <li>Dungeons & Dragons</li>
          <li>Vegan recipes</li>
          <li>Dogs</li>
          <li>FIFA</li>
          <li>Yoga</li>
          <li>Calligraphy</li>
        </ul>
      </div>

      <div class="return">
        <button class="return" onClick={toMain}>
          Return to Chat
        </button>
      </div>
    </div>
  );
}

export default Profile;
