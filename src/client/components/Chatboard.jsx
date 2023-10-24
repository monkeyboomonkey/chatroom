import React, { useContext } from "react";
import { useState, useEffect, useRef } from "react";
import Chatcategory from "./Chatcategory";
import Chatbox from "./Chatbox";
import "../styles/style.css";
import { SocketContext } from "../Context";
import { ChatDataList } from "./ChatList/ChatDataList";
import Navbar from "./Navbar";

function Chatboard(props) {
  const socket = useContext(SocketContext);
  console.log('socket in Chatboard is:')
  console.log(socket)

  const chatBoxRef = useRef(null);
  const newRoomDivRef = useRef(null);
  const newRoomText = useRef(null);
  const [categories, setCategories] = useState(["lobby"]);
  // listen for active rooms and set rooms/categories
  useEffect(() => {
    const handleRoomsData = (data) => {
      console.log("Rooms Data:", data);
      setCategories(data);
    };

    socket.on("rooms", handleRoomsData);

    // Cleanup the socket listener when the component unmounts
    return () => {
      socket.off("rooms", handleRoomsData);
    };
  }, []);


  const [roomName, setRoomName] = useState("");
  const handleSwitchRoom = (roomName) => {
    console.log("Handling switch rooooooooom");
    const chatBoxDiv = chatBoxRef.current;
    const chatBoxDisplay = chatBoxDiv.querySelector(".chatDisplay");
    chatBoxDisplay.innerText = "";
    console.log("> > > chatBoxDisplay.value: ", chatBoxDisplay.value);
    console.log("> > > chatBoxDisplay: ", chatBoxDisplay);
    console.log(">>> chatBoxDiv: ", chatBoxDiv);
    setRoomName(roomName);
  };
  const handleNewRoomClicked = () => {
    newRoomDivRef.current.style.display = "block";
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
          />
          <div className="chatCategoryList">
            <Chatcategory
              handleSwitchRoom={handleSwitchRoom}
              categories={categories}
            />
          </div>
        </div>
        <div className="chatBox" ref={chatBoxRef}>
          <Chatbox roomName={roomName} user={props.user}/>
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
