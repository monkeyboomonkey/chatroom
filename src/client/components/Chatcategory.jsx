import React from "react";
import Chatroom from "./Chatroom.jsx";
import { useSelector } from "react-redux";

function Chatcategory({ handleSwitchRoom }) {
  const categories = useSelector((state) => state.categories);
  return (
    <div>
      <h3>All active rooms</h3>
      <div className="allChatCategories">
        {categories.map((chatroom, index) => (
          <Chatroom
            key={index}
            id={chatroom}
            switchRoom={handleSwitchRoom}
          />
        ))}
      </div>
    </div>
  );
}

export default Chatcategory;
