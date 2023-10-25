import React, { useContext, useState } from "react";
import { SocketContext } from "../../Context";
import { useSelector } from "react-redux";

export function ChatDataList() {
  const { socket } = useContext(SocketContext);
  const [newRoomName, setNewRoomName] = useState(""); // to be used for creating new room
  const categories = useSelector((state) => state.chatroomReducer.categories);
  console.log("ChatDataList Categories", categories);

  const generateRoomList = (rooms) => {
    const roomList = [<option key={"lobby"} value="lobby"></option>];
    if (rooms) {
      rooms.forEach((room, indx) => {
        roomList.push(<option key={indx} value={room}>{room}</option>);
      });
    }
    return roomList
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRoom = newRoomName;
    socket.emit("joinRoom", newRoom);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="roomFormLabel" htmlFor="chatroom-choice">Choose or create a topic:</label>
        </div>
        <div className="roomForm">
          <input list="browsers" id="roomName" name="Room" value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)}/>
          <input id="joinRoomButton" type="submit" value="Join"></input>
        </div>
      </form>
      <datalist id="browsers">{generateRoomList(categories)}</datalist>
    </div>
  );
}
