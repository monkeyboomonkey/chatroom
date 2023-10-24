import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import "../styles/Profile.scss";

function Update() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const [img, setImg] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpaiczmKCa_Gd7MeORuu_nN7mUxR9we2h5Xc3sY-ZAjYBwhz0knH63sq77l9BM6GULDmE&usqp=CAU"
  );

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

  const handleIMGChange = async (e) => {
    const { name } = e.target;

    const randKey = String(Math.floor(Math.random() * 10000));

    const constructURL = {
      bucketName: "listing-photos-scout",
      region: "us-west-1",
      key: randKey,
    };

    try {
      const presignedURLRequest = await fetch("/api/getSignedURL", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: constructURL.key }),
      });
      //   if (!presignedURL.ok) throw new Error("Error getting presigned URL");
      const presignedURL = await presignedURLRequest.json();
      const imgFile = e.target.files[0];
      const uploadPicture = await fetch(presignedURL, {
        method: "PUT",
        headers: { "Content-Type": "multipart/form-data" },
        body: imgFile,
      });
      //   if (!uploadPicture.ok)
      //     throw new Error("Error uploading image into S3 Bucket");
    } catch (e) {
      console.log(e, "ERROR Uploading image to S3 DB");
    }

    const imgLink = `https://listing-photos-scout.s3.us-west-1.amazonaws.com/${randKey}`;
    // test setIMG

    setFormData(name, imgLink);
    setImg(imgLink);
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
      <img className="round" src={img} alt="user" />
      <div className="nuform">
        <form ref={formRef} onSubmit={handleInputChange}>
          <label>
            <input
              type="file"
              name="profilePicture"
              placeholder="test"
              onChange={handleIMGChange}
            ></input>
          </label>
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

export default Update;
