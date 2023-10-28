import React from "react";
import Chatroom from "./Chatroom";
import { useSelector } from "react-redux";
function Chatcategory() {
    const categories = useSelector((state) => state.chatroomReducer.categories);
    return (React.createElement("div", { id: "outerCategoryContainer" },
        React.createElement("h3", null, "All active rooms"),
        React.createElement("div", { className: "allChatCategories" }, categories.map((chatroom, index) => (React.createElement(Chatroom, { key: index, id: chatroom }))))));
}
export default Chatcategory;
//# sourceMappingURL=Chatcategory.js.map