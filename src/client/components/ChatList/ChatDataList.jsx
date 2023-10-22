import React, { useContext } from "react";
import { SocketContext } from "../../Context";
import { useSelector } from "react-redux";

export function ChatDataList() {
  const { socket } = useContext(SocketContext);
  const categories = useSelector((state) => state.categories);
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
    const roomForm = document.getElementById("roomName");
    const selectedRoom = roomForm.value;
    console.log("Selected room ", selectedRoom);
    socket.emit("joinRoom", selectedRoom);
    roomForm.value = "";
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="chatroom-choice">Choose or create a topic:</label>
        </div>
        <div>
          <input list="browsers" id="roomName" name="Room" />
          <input id="joinRoomButton" type="submit" value="Join"></input>
        </div>
      </form>
      <datalist id="browsers">{generateRoomList(categories)}</datalist>
    </div>
  );
}
