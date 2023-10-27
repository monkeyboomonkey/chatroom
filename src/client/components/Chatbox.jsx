// import React from "react";
// import { useEffect, useContext, useState, useRef } from "react";
// import "../styles/style.css";
// import Chatboxheader from "./Chatboxheader.jsx";
// import { SocketContext } from "../Context";
// import { useSelector } from "react-redux";

// function Chatbox() {
//   const { socket } = useContext(SocketContext);
//   const [userMessage, setUserMessage] = useState(""); // message input field
//   const [userImageMessage, setUserImageMessage] = useState("");
//   const chatDisplayRef = useRef(null);
//   const roomName = useSelector(
//     (state) => state.chatroomReducer.currentChatroom
//   ); //* get current room name
//   const currentChatroomState = useSelector(
//     (state) => state.chatroomReducer.currentChatroomState
//   ); //* get current room state, that being all messages in the room
//   const username = useSelector((state) => state.chatroomReducer.username); //* get username from redux store

//   const handleSendBtnClicked = () => {
//     if (userMessage?.length > 0) {
//       socket.emit("message", { message: userMessage }); //* send message to server
//       console.log("Socket pushed: ", userMessage);
//       setUserMessage(""); //* clear input field
//     }
//     if (userImageMessage.name) {
//       socket.emit("message", { message: userImageMessage });
//       setUserImageMessage("");
//     }
//   };

//   const handleReceiveMessage = (data) => {
//     const { username, message } = data;
//     console.log("Socket pulled", data);
//     dispatch(addNewChat({ username, message }));
//     chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
//   };

//   const startDM = (e) => {
//     console.log(username);
//     if (e.target.getAttribute("value") === username) {
//       console.log("Cannot DM self");
//       return; //* if user clicks on their own username, do nothing (cannot DM self)
//     }
//     const targetUser = e.target.getAttribute("value"); //* get username of user clicked on, getAttribute comes from React
//     // console.log("DM username: ", username);
//     socket.emit("startDM", { username: targetUser });
//   };

//   useEffect(() => {
//     chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight; // auto scroll to bottom of chat display
//   }, [currentChatroomState]);

//   return (
//     <div className="innerChatBox">
//       <Chatboxheader roomName={roomName} />
//       <div className="chatDisplay" ref={chatDisplayRef}>
//         {/* This is where all chat messages from current room are displayed */}
//         {/* if the message is a system message then we append a special kind of message div, otherwise append normal message */}
//         {currentChatroomState.reduce(async (messages, currMessage, index) => {
//           // const result = await fetch('/chatroomID', {method : "POST",
//           // headers:{"Content-Type" : "application/json"},
//           // body:JSON.stringify({chatroom_name:roomName})}
//           // )
//           // console.log(await result.json(),'RESULTTTT')

//           const chat = currMessage;

//           if (chat.username === "System") {
//             messages.push(
//               <div key={index} className="systemMessage">
//                 {chat.message}
//               </div>
//             );
//           } else if (chat.message instanceof ArrayBuffer) {
//             const blob = new Blob([chat.message]);
//             const srcBlob = URL.createObjectURL(blob);
//             messages.push(
//               <div key={index} className="userMessage">
//                 <span
//                   value={chat.username}
//                   className="usernameDisplay"
//                   onClick={startDM}
//                 >
//                   {chat.username}
//                 </span>
//                 <span className="messageDisplay">
//                   <img className="chatImage" src={srcBlob}></img>
//                 </span>
//               </div>
//             );
//           } else {
//             messages.push(
//               <div key={index} className="userMessage">
//                 <span
//                   value={chat.username}
//                   className="usernameDisplay"
//                   onClick={startDM}
//                 >
//                   {chat.username}
//                 </span>
//                 <span className="messageDisplay">{chat.message}</span>
//               </div>
//             );
//           }
//           return messages;
//         }, [])}
//       </div>
//       <div className="chatControl">
//         <div className="outerTextContainer">
//           <input
//             disabled={roomName === null ? true : false}
//             type="text"
//             id="messageInput"
//             className="messageContent"
//             onChange={(e) => setUserMessage(e.target.value)}
//             value={userMessage}
//           />
//         </div>
//         <button
//           disabled={roomName === null ? true : false}
//           className="sendBtn"
//           onClick={handleSendBtnClicked}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Chatbox;

import React from "react";
import { useEffect, useContext, useState, useRef } from "react";
import "../styles/style.css";
import Chatboxheader from "./Chatboxheader.jsx";
import { SocketContext } from "../Context";
import { useSelector, useDispatch } from "react-redux";
import { addNewChat, setCurrentChatroom } from "../util/chatroomReducer";

function Chatbox() {
  const { socket } = useContext(SocketContext);
  const [userMessage, setUserMessage] = useState(""); //* message input field
  const [userImage, setUserImage] = useState("");
  const chatDisplayRef = useRef(null);
  const dispatch = useDispatch();
  const roomName = useSelector(
    (state) => state.chatroomReducer.currentChatroom
  ); //* get current room name
  const currentChatroomState = useSelector(
    (state) => state.chatroomReducer.currentChatroomState
  ); //* get current room state, that being all messages in the room
  const username = useSelector((state) => state.chatroomReducer.username); //* get username from redux store

  const handleSendBtnClicked = () => {
    if (userMessage?.length > 0) {
      socket.emit("message", { message: userMessage }); //* send message to server
      console.log("Socket pushed: ", userMessage);
      setUserMessage(""); //* clear input field
    }
    if (userImage.name) {
      socket.emit("message", { message: userImage });
      setUserImage("");
      document.getElementById("imageInput").value = "";
    }
  };

  const startDM = (e) => {
    console.log(username);
    if (e.target.getAttribute("value") === username) {
      console.log("Cannot DM self");
      return; //* if user clicks on their own username, do nothing (cannot DM self)
    }
    const targetUser = e.target.getAttribute("value"); //* get username of user clicked on, getAttribute comes from React
    // console.log("DM username: ", username);
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
        console.log(parsedChat);
        const username = parsedChat.username;
        const message = parsedChat.message;
        dispatch(addNewChat({ username, message }));
      }
    } catch (e) {
      console.log("Unable to pull chat history due to ", e);
    }
  };

  const arrayBufferToLink = (buf) => {
    const uint8Array = new Uint8Array(buf);
    const blob = new Blob([uint8Array]);
    const srcBlob = URL.createObjectURL(blob);
    return srcBlob;
  };
  const bufferToLink = (buf) => {
    const blob = new Blob([buf]);
    const srcBlob = URL.createObjectURL(blob);
    return srcBlob;
  };

  useEffect(() => {
    if (!roomName) return;
    pullChatHistory(roomName);
  }, [roomName]);

  useEffect(() => {
    chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight; // auto scroll to bottom of chat display
  }, [currentChatroomState]);

  return (
    <div className="innerChatBox">
      <Chatboxheader roomName={roomName} />
      <div className="chatDisplay" ref={chatDisplayRef}>
        {/* This is where all chat messages from current room are displayed */}
        {/* if the message is a system message then we append a special kind of message div, otherwise append normal message */}
        {currentChatroomState.reduce((messages, currMessage, index) => {
          const chat = currMessage;
          console.log(typeof chat.message);
          if (chat.username === "System") {
            messages.push(
              <div key={index} className="systemMessage">
                {chat.message}
              </div>
            );
            /**
             * We need to account for two types of binary data here and handle accordingly
             * 1) ArrayBuffer (from client side)
             * 2) Buffer (how images are stored)
             */
          } else if (
            chat.message instanceof ArrayBuffer ||
            chat.message.type === "Buffer"
          ) {
            let srcBlob = null;
            if (currMessage.message.data) {
              srcBlob = arrayBufferToLink(currMessage.message.data);
            } else {
              console.log("else should hit");
              srcBlob = bufferToLink(chat.message);
            }
            messages.push(
              <div key={index} className="userMessage">
                <span
                  value={chat.username}
                  className="usernameDisplay"
                  onClick={startDM}
                >
                  {chat.username}
                </span>
                <span className="messageDisplay">
                  <img className="chatImage" src={srcBlob}></img>
                </span>
              </div>
            );
          } else {
            messages.push(
              <div key={index} className="userMessage">
                <span
                  value={chat.username}
                  className="usernameDisplay"
                  onClick={startDM}
                >
                  {chat.username}
                </span>
                <span className="messageDisplay">{chat.message}</span>
              </div>
            );
          }
          return messages;
        }, [])}
      </div>
      <div className="chatControl">
        <div className="outerTextContainer">
          <input
            disabled={roomName === null ? true : false}
            type="text"
            id="messageInput"
            className="messageContent"
            onChange={(e) => setUserMessage(e.target.value)}
            value={userMessage}
          />
        </div>
        <input
          disabled={roomName === null ? true : false}
          type="file"
          id="imageInput"
          accept=".png, .jpg, .jpeg"
          onChange={(e) => {
            setUserImage(e.target.files[0]);
          }}
        />
        <button
          disabled={roomName === null ? true : false}
          className="sendBtn"
          onClick={handleSendBtnClicked}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbox;
