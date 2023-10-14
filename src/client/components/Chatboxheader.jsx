import React, { useContext, useEffect } from "react";
import "../styles/style.css";
import { StateContext } from "../Context";

function Chatboxheader(props) {
  const { userState } = useContext(StateContext);
  const [user, setUser] = userState;

  return (
    <div>
      {props.roomName !== "" ? (
        <h3>Welcome to room #{props.roomName}</h3>
      ) : (
        <h3>You're in the lobby. Create or pick a room to chat!</h3>
      )}
    </div>
  );
}

export default Chatboxheader;
