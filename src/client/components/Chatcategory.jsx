import React from "react";
import Chatroom from "./Chatroom.jsx";
import { useSelector } from "react-redux";

function Chatcategory() {
  const categories = useSelector((state) => state.chatroomReducer.categories);
  return (
    <div id="outerCategoryContainer">
      <h3>All active rooms</h3>
      <div className="allChatCategories">
        {categories.map((chatroom, index) => (
          <Chatroom
            key={index}
            id={chatroom}
          />
        ))}
      </div>
    </div>
  );
}

export default Chatcategory;
