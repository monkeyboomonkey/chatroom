import React, { useContext } from "react";
import { useEffect } from "react";
import Chatcategory from "./Chatcategory.jsx";
import Chatbox from "./Chatbox.jsx";
import "../styles/style.css";
import { SocketContext } from "../Context";
import { ChatDataList } from "./ChatList/ChatDataList.jsx";
import Navbar from "./Navbar.jsx";
import { useDispatch } from "react-redux";
import { setCurrentCategories } from "../chatroomReducer.ts";

function Chatboard() {
  const { socket } = useContext(SocketContext);
  const dispatch = useDispatch();

  // listen for active rooms and set rooms/categories
  useEffect(() => {
    const handleRoomsData = (data) => {
      console.log("Rooms Data:", data);
      dispatch(setCurrentCategories(data));
    };
    socket.on("rooms", handleRoomsData); // make sure to use same function reference to remove correct listener, or use no second argument to remove all listeners
    // Cleanup the socket listener when the component unmounts
    return () => {
      socket.off("rooms", handleRoomsData);
    };
  }, []);

  return (
    <div className="innerContainerMain">
      <Navbar />
      <div className="chatboard">
        <div className="chatCategory">
          <ChatDataList />
          <div className="chatCategoryList">
            <Chatcategory />
          </div>
        </div>
        <div className="chatBox" >
          <Chatbox />
        </div>
      </div>
    </div>
  );
}

export default Chatboard;
