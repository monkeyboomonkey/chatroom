import React, { useContext, useEffect } from "react";
import "../styles/style.css";
import { StateContext } from "../Context";

function Chatboxheader(props) {
  const { userState } = useContext(StateContext);
  const [user, setUser] = userState;

  useEffect(() => {
    console.log("Testing Context");
    console.log(userState);
    setUser("Ryan");
    console.log(user);
  }, []);

  return (
    <div>
      {props.roomName !== undefined ? (
        <h3>
          Welcome {user} to room #{props.roomName}
        </h3>
      ) : (
        <h3>
          You're in the lobby. Pick your interested room to start chatting!
        </h3>
      )}
    </div>
  );
}

export default Chatboxheader;
