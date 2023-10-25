import React, { useContext, useEffect } from "react";
import Chatcategory from "./Chatcategory.jsx";
import Chatbox from "./Chatbox.jsx";
import "../styles/style.css";
import { ChatDataList } from "./ChatList/ChatDataList.jsx";
import Navbar from "./Navbar.jsx";
import { useDispatch, useSelector } from "react-redux";

function Chatboard() {
  const currentChatroom = useSelector(
    (state) => state.chatroomReducer.currentChatroom
  );
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
