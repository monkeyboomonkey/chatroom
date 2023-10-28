import React, { useContext, useState } from "react";
import { SocketContext } from "../../Context";
import { useSelector } from "react-redux";

export function ChatDataList() {
  const { socket } = useContext(SocketContext);
  const [newRoomName, setNewRoomName] = useState(""); // to be used for creating new room

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRoom = newRoomName;
    setNewRoomName("");
    socket.emit("joinRoom", newRoom);
  };

  return (
    <div className="formContainer">
      <form onSubmit={handleSubmit}>
        <div className="roomForm">
          <input 
            list="roomlist"
            id="roomName" 
            name="Room" 
            value={newRoomName} 
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Join or create a room"
          />
          <input id="joinRoomButton" type="submit" value="Join"></input>
        </div>
      </form>
    </div>
  );
}
