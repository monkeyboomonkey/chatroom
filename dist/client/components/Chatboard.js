import React from "react";
import Chatcategory from "./Chatcategory";
import Chatbox from "./Chatbox";
import "../styles/style.css";
import { ChatDataList } from "./ChatList/ChatDataList";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
function Chatboard() {
    const currentChatroom = useSelector((state) => state.chatroomReducer.currentChatroom);
    const roomActive = currentChatroom !== null;
    return (React.createElement("div", { className: "innerContainerMain" },
        React.createElement(Navbar, null),
        React.createElement("div", { className: "chatboard" },
            !roomActive ?
                React.createElement("div", { className: "chatCategory" },
                    React.createElement(ChatDataList, null),
                    React.createElement("div", { className: "chatCategoryList" },
                        React.createElement(Chatcategory, null))) : null,
            React.createElement("div", { className: "chatBox" },
                React.createElement(Chatbox, null)))));
}
export default Chatboard;
//# sourceMappingURL=Chatboard.js.map