import React from "react";
import { useEffect, useContext, useState, useRef } from "react";
import "../styles/style.css";
import Chatboxheader from "./Chatboxheader";
import { SocketContext } from "../Context";
import { useSelector, useDispatch } from "react-redux";
import { addNewChat } from "../util/chatroomReducer";
function Chatbox() {
    const { socket } = useContext(SocketContext);
    const [userMessage, setUserMessage] = useState(""); //* message input field
    const [userImage, setUserImage] = useState(""); //* image input field
    const chatDisplayRef = useRef(null);
    const imageInputRef = useRef(null);
    const dispatch = useDispatch();
    const roomName = useSelector((state) => state.chatroomReducer.currentChatroom); //* get current room name
    const currentChatroomState = useSelector((state) => state.chatroomReducer.currentChatroomState); //* get current room state, that being all messages in the room
    const username = useSelector((state) => state.chatroomReducer.username); //* get username from redux store
    const handleSendBtnClicked = () => {
        if ((userMessage === null || userMessage === void 0 ? void 0 : userMessage.length) > 0) {
            socket.emit("message", { message: userMessage }); //* send message to server
            setUserMessage(""); //* clear input field
        }
        if (userImage instanceof File) {
            socket.emit("message", { message: userImage });
            setUserImage("");
            chatDisplayRef.current.value = "";
        }
    };
    const startDM = (e) => {
        if (e.currentTarget.getAttribute("data-value") === username)
            return; //* if user clicks on their own username, do nothing (cannot DM self)
        const targetUser = e.currentTarget.getAttribute("data-value"); //* get username of user clicked on, getAttribute comes from React
        socket.emit("startDM", { username: targetUser });
    };
    // Function to remove spaces, since Redis cant store keys with spaces
    const removeSpaces = (str) => {
        return str.replace(/\s/g, "");
    };
    // Function to pull most recent chat history (30 messages)
    const pullChatHistory = async (roomName) => {
        try {
            const updatedRoomName = removeSpaces(roomName);
            const chatHistoryRequest = await fetch("/api/getChatHistory", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chatroom_name: updatedRoomName }),
            });
            const chatHistoryResults = await chatHistoryRequest.json();
            for (let i = chatHistoryResults.length - 1; i >= 0; i--) {
                const parsedChat = JSON.parse(chatHistoryResults[i]);
                const username = parsedChat.username;
                const message = parsedChat.message;
                dispatch(addNewChat({ username, message }));
            }
        }
        catch (e) {
            console.log("Unable to pull chat history due to ", e);
        }
    };
    const openImageUploader = (e) => {
        imageInputRef.current.click();
    };
    useEffect(() => {
        if (!roomName)
            return;
        pullChatHistory(roomName);
    }, [roomName]);
    useEffect(() => {
        if (!chatDisplayRef.current)
            return;
        chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight; // auto scroll to bottom of chat display
    }, [currentChatroomState]);
    return (React.createElement("div", { className: "innerChatBox" },
        React.createElement(Chatboxheader, null),
        React.createElement("div", { className: "chatDisplay", ref: chatDisplayRef }, currentChatroomState.reduce((messages, currMessage, index) => {
            const chat = currMessage;
            if (chat.username === "System" && typeof chat.message === "string") {
                messages.push(React.createElement("div", { key: index, className: "systemMessage" }, chat.message));
                /**
                 * We need to account for two types of binary data here and handle accordingly
                 * 1) ArrayBuffer (from client side)
                 * 2) Buffer (how images are stored)
                 */
            }
            else if (typeof chat.message === "object" && chat.message.type === "img") {
                messages.push(React.createElement("div", { key: index, className: "userMessage" },
                    React.createElement("span", { "data-value": chat.username, className: "usernameDisplay", onClick: startDM }, chat.username),
                    React.createElement("span", { className: "messageDisplay" },
                        React.createElement("img", { style: { maxWidth: '250px', maxHeight: '250px' }, className: "chatImage", src: chat.message.url }))));
            }
            else if (typeof chat.message === "string") {
                messages.push(React.createElement("div", { key: index, className: "userMessage" },
                    React.createElement("span", { className: "profilePictureDisplay" },
                        React.createElement("img", { "data-value": chat.username, style: {
                                display: 'inline',
                                minWidth: '70px',
                                height: '70px',
                                borderRadius: '50%',
                            }, onClick: startDM, src: currMessage.userProfilePic ? currMessage.userProfilePic : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png", alt: "profile pic", className: "profilePic" })),
                    React.createElement("span", { className: "messageDisplay" },
                        React.createElement("span", { className: "usernameDisplay" }, chat.username),
                        ": ",
                        chat.message)));
            }
            else {
                console.log("Error: message type not recognized", chat.message);
            }
            return messages;
        }, [])),
        React.createElement("div", { className: "chatControl" },
            React.createElement("div", { className: "outerTextContainer" },
                React.createElement("input", { disabled: roomName === null ? true : false, type: "text", id: "messageInput", className: "messageContent", onChange: (e) => setUserMessage(e.target.value), value: userMessage }),
                React.createElement("button", { className: "material-symbols-outlined", id: "imageInputButton", onClick: (e) => {
                        openImageUploader(e);
                    } }, "photo_library"),
                React.createElement("input", { disabled: roomName === null ? true : false, type: "file", id: "imageInput", ref: imageInputRef, accept: ".png, .jpg, .jpeg", onChange: (e) => {
                        if (!e.target.files || e.target.files.length === 0)
                            return;
                        setUserImage(e.target.files[0]);
                    } })),
            React.createElement("button", { disabled: roomName === null ? true : false, className: "sendBtn", onClick: handleSendBtnClicked }, "Send"))));
}
export default Chatbox;
//# sourceMappingURL=Chatbox.js.map