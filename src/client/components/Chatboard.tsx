import React from "react";
import Chatcategory from "./Chatcategory";
import Chatbox from "./Chatbox";
import "../styles/style.css";
import { ChatDataList } from "./ChatList/ChatDataList";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { RootState } from '../util/store'

function Chatboard() {
  const currentChatroom = useSelector((state: RootState) => state.chatroomReducer.currentChatroom);
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
