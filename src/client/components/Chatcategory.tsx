import React from "react";
import Chatroom from "./Chatroom.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../util/store.ts";

function Chatcategory() {
  const categories = useSelector((state: RootState) => state.chatroomReducer.categories);
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
