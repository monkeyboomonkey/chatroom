import React from "react";
import Chatroom from "./Chatroom";
import { useEffect, useContext } from "react";
import { SocketContext } from "../Context";

function Chatcategory(props) {
  const { socket } = useContext(SocketContext);
  const handleSwitchRoomEvent = (id, currentRoom, allChatRooms) => {
    console.log(`Switching to room: ${id}`);
    console.log('currentRoom, allChatRooms: ', currentRoom, allChatRooms);
    // socket.emit('switchroom', id);
    for(const chatroom of allChatRooms) {
        chatroom.classList.remove('activeRoom');
        // chatroom.disabled = false;
        console.log(chatroom)
    }
    const activeRoom = document.getElementById(`${props.roomName}`);
    console.log('activeRoom: ', activeRoom);
    activeRoom.classList.add('activeRoom');
    activeRoom.disabled = true;
    console.log('~~~>>>currentRoom, allChatRooms: ', currentRoom, allChatRooms);
    props.handleSwitchRoom(id, currentRoom, allChatRooms);
    socket.emit("joinRoom", id);
  };

  return (
    <div className="chatCategoryDiv">
      <h3>All active rooms</h3>
      {props.categories.length ? <div className="allChatCategories">
        {props.categories.map((chatroom, index) => (
          <Chatroom
            key={index}
            id={chatroom}
            switchRoom={handleSwitchRoomEvent}
          />
        ))}
      </div> : <h4><i>---------No active rooms---------</i></h4>}
      
    </div>
  );
}

export default Chatcategory;
