import React, { useRef, ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigateTo } from "./Main";
import { setUserIdentity } from "../util/chatroomReducer";
import { RootState } from '../util/store';
import "../styles/Profile.scss";

const Update = () => {
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const image = useSelector((state: RootState) => state.chatroomReducer.userIdentity.pictureURL);
  const navigateTo = useNavigateTo();

  function toMain() {
    navigateTo("/");
  }
  function toProfile() {
    navigateTo("/profile");
  }

  const formData = new FormData();
  const setFormData = (name: string, value: string) => {
    formData.set(name, value);
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(name, value);
  };

  const handleIMGChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;

    // Fix this if time, random number generator for Key generation but could potentially generate same number twice rn
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
      const presignedURL = await presignedURLRequest.json();

      if (!e.target.files) throw new Error("No file selected");
      const imgFile = e.target.files[0];

      const uploadPicture = await fetch(presignedURL, {
        method: "PUT",
        headers: { "Content-Type": "multipart/form-data" },
        body: imgFile,
      });

      if (!uploadPicture.ok) throw new Error("Error uploading image into S3 Bucket");
    } catch (e) {
      console.log(e, "ERROR Uploading image to S3 DB");
    }

    const imgLink = `https://listing-photos-scout.s3.us-west-1.amazonaws.com/${randKey}`;
    setFormData(name, imgLink);
  };

  const handleSubmit = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(formData);
    try {
      const res = await fetch("/api/updateuser", {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`res.status: ${res.status}`);
      const user = await res.json();
      console.log(user,'userinfo@@@@@@@')
      dispatch(setUserIdentity(user)); //* update redux store with updated user info
      navigateTo("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="outerContainer">      
      <div className="card-container">
        <img
          width={"200"}
          height={"200"}
          className="round"
          src={image}
          alt="user"
        />
        <div className="nuform">
          <form ref={formRef} onSubmit={handleSubmit}>
            <label>
              <input
                type="file"
                name="profilePicture"
                placeholder="test"
                onChange={handleIMGChange}
              >
              </input>
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
          <ul>
            
          </ul>
        </div>
        <div className="return">
          <button className="return" onClick={toMain}>
            Return to Chat
          </button>
        </div>
      </div>
    </div>
  );
}

export default Update;
