import React, { useContext, useEffect } from "react";
import Chatcategory from "./Chatcategory.jsx";
import Chatbox from "./Chatbox.jsx";
import "../styles/style.css";
import { SocketContext } from "../Context";
import { ChatDataList } from "./ChatList/ChatDataList.jsx";
import Navbar from "./Navbar.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentCategories } from "../chatroomReducer.ts";

function Chatboard() {
  const { socket } = useContext(SocketContext);
  const dispatch = useDispatch();
  const currentChatroom = useSelector(
    (state) => state.chatroomReducer.currentChatroom
  );

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
  console.log("Current Chatroom:", currentChatroom)
  const roomActive = currentChatroom !== null;
  return (
    <div className="innerContainerMain">
      <Navbar />
      <div className="chatboard">
        {!roomActive ?
          <div className="chatCategory">
          <ChatDataList />
          <div className="chatCategoryList">
            <Chatcategory />
          </div>
        </div> : null}
        <div className="chatBox" >
          <Chatbox />
        </div>
      </div>
    </div>
  );
}

export default Chatboard;
