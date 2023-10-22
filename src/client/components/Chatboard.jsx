import React, { useContext } from "react";
import { useState, useEffect, useRef } from "react";
import Chatcategory from "./Chatcategory.jsx";
import Chatbox from "./Chatbox.jsx";
import "../styles/style.css";
import { SocketContext } from "../Context";
import { ChatDataList } from "./ChatList/ChatDataList.jsx";
import Navbar from "./Navbar.jsx";
import { useDispatch } from "react-redux";
import { setCurrentChatroom, setCurrentCategories } from "../chatroomReducer.ts";

function Chatboard() {
  const { socket } = useContext(SocketContext);
  const dispatch = useDispatch();
  const chatBoxRef = useRef(null);
  const newRoomDivRef = useRef(null);
  const newRoomText = useRef(null);

  console.log("socket: ", socket)
  // listen for active rooms and set rooms/categories
  useEffect(() => {
    const handleRoomsData = (data) => {
      console.log("Rooms Data:", data);
      dispatch(setCurrentCategories(data));
    };

    socket.on("rooms", handleRoomsData);

    // Cleanup the socket listener when the component unmounts
    return () => {
      socket.off("rooms", handleRoomsData);
    };
  }, []);

  const handleSwitchRoom = (roomName) => {
    console.log(`Switching to room: ${roomName}`);
    const chatBoxDiv = chatBoxRef.current;
    const chatBoxDisplay = chatBoxDiv.querySelector(".chatDisplay");
    chatBoxDisplay.innerText = "";
    console.log("> > > chatBoxDisplay.value: ", chatBoxDisplay.value);
    console.log("> > > chatBoxDisplay: ", chatBoxDisplay);
    console.log(">>> chatBoxDiv: ", chatBoxDiv);
    dispatch(setCurrentChatroom(roomName));
    socket.emit("joinRoom", roomName);
  };

  const handleNewRoomFormSubmit = (e) => {
    e.preventDefault();
    const newRoomName = newRoomText.current.value;
    newRoomText.current.value = "";
    newRoomDivRef.current.style.display = "none";
    console.log("newRoomName: ", newRoomName);
    handleSwitchRoom(newRoomName);
    socket.emit("joinRoom", newRoomName);
  };

  return (
    <div>
      <Navbar />
      <div className="chatboard">
        <div className="chatCategory">
          <ChatDataList />
          <div className="chatCategoryList">
            <Chatcategory
              handleSwitchRoom={handleSwitchRoom}
            />
          </div>
        </div>
        <div className="chatBox" ref={chatBoxRef}>
          <Chatbox />
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
    </div>
  );
}

export default Chatboard;
