import React, { useContext } from "react";
import { useState, useEffect, useRef } from "react";
import Chatcategory from "./Chatcategory";
import Chatbox from "./Chatbox";
import "../styles/style.css";
import { SocketContext } from "../Context";
import { ChatDataList } from "./ChatList/ChatDataList";
import Navbar from "./Navbar";

function Chatboard() {
  const { socket } = useContext(SocketContext);

  const chatBoxRef = useRef(null);
  const newRoomDivRef = useRef(null);
  const newRoomText = useRef(null);
  const [categories, setCategories] = useState([]);
  // const [activeRoom, setActiveRoom] = useState('');

  // listen for active rooms and set rooms/categories
  useEffect(() => {
    socket.on("rooms", (data) => {
      console.log(data);
      setCategories(data.slice(1));
      console.log(categories);
    });
  }, []);

  const [roomName, setRoomName] = useState("");
  const handleSwitchRoom = (roomName, currentRoom, allChatRooms) => {
    console.log('currentRoom, allChatRooms: ', currentRoom, allChatRooms);
    const chatBoxDiv = chatBoxRef.current;
    const chatBoxDisplay = chatBoxDiv.querySelector(".chatDisplay");
    chatBoxDisplay.innerText = "";
    // if (!allChatRooms) {
    //   allChatRooms = document.querySelectorAll('.chatroom');
    // }
    // console.log('~!~ allChatRooms after: ', allChatRooms);
    // if(!currentRoom) {
    //   currentRoom = document.getElementById(`${roomName}`);
    // }
    // console.log(';;;;; currentRoom after: ', currentRoom);
    // for(const chatroom of allChatRooms) {
    //   chatroom.classList.remove('activeRoom');
    //   console.log(chatroom)
    // }
    // currentRoom.classList.add('activeRoom');
    socket.emit("joinRoom", roomName);
    // setActiveRoom(roomName);
    setRoomName(roomName);
  };
  const handleNewRoomFormSubmit = (e) => {
    const newRoomName = newRoomText.current.value;
    newRoomText.current.value = "";
    newRoomDivRef.current.style.display = "none";
    console.log("newRoomName: ", newRoomName);
    const updatedCategories = [...categories, newRoomName];
    handleSwitchRoom(newRoomName);
    socket.emit("joinRoom", newRoomName);
    // setCategories(updatedCategories);
  };
  return (
    <>
      <Navbar />
      <div className="chatboard">
        <div className="chatCategory">
          <ChatDataList
            categories={categories}
            setCategories={setCategories}
            setRoomName={setRoomName}
            handleSwitchRoom={handleSwitchRoom}
          />
          <div className="chatCategoryList">
            <Chatcategory
              handleSwitchRoom={handleSwitchRoom}
              categories={categories}
              roomName={roomName}
            />
          </div>
        </div>
        <div className="chatBox" ref={chatBoxRef}>
          <Chatbox roomName={roomName} />
        </div>
      </div>
      <div ref={newRoomDivRef} className="newRoomDiv">
        <form onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="Enter a topic" ref={newRoomText} />
          <input
            type="submit"
            value="Create"
            onClick={handleNewRoomFormSubmit}
          />
        </form>
      </div>
    </>
  );
}

export default Chatboard;
