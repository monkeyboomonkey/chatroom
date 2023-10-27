import React from "react";
import { useEffect, useContext, useState, useRef, ReactElement, FormEvent } from "react";
import "../styles/style.css";
import Chatboxheader from "./Chatboxheader.tsx";
import { SocketContext } from "../Context.ts";
import { useSelector, useDispatch } from "react-redux";
import { Chat, addNewChat } from "../util/chatroomReducer.ts";
import { RootState } from "../util/store.ts";

function Chatbox() {
  const { socket } = useContext(SocketContext);
  const [userMessage, setUserMessage] = useState(""); //* message input field
  const [userImage, setUserImage] = useState<string | File>(""); //* image input field
  const chatDisplayRef = useRef(null) as any;
  const imageInputRef = useRef(null) as any;
  const dispatch = useDispatch();

  const roomName = useSelector(
    (state: RootState) => state.chatroomReducer.currentChatroom
  ); //* get current room name
  const currentChatroomState = useSelector(
    (state: RootState) => state.chatroomReducer.currentChatroomState
  ); //* get current room state, that being all messages in the room
  const username = useSelector((state: RootState) => state.chatroomReducer.username); //* get username from redux store

  const handleSendBtnClicked = () => {
    if (userMessage?.length > 0) {
      socket.emit("message", { message: userMessage }); //* send message to server
      console.log("Socket pushed: ", userMessage);
      setUserMessage(""); //* clear input field
    }

    if (userImage?.length > 0) {
      socket.emit("message", { message: userImage });
      setUserImage("");
      chatDisplayRef.current.value = "";
    }
  };

  const startDM = (e: FormEvent<HTMLElement>) => {
    console.log(username);
    if (e.currentTarget.getAttribute("data-value") === username) {
      console.log("Cannot DM self");
      return; //* if user clicks on their own username, do nothing (cannot DM self)
    }
    const targetUser = e.currentTarget.getAttribute("data-value"); //* get username of user clicked on, getAttribute comes from React
    // console.log("DM username: ", username);
    socket.emit("startDM", { username: targetUser });
  };

  // Function to remove spaces, since Redis cant store keys with spaces
  const removeSpaces = (str: string) => {
    return str.replace(/\s/g, "");
  };

  // Function to pull most recent chat history (30 messages)
  const pullChatHistory = async (roomName: string) => {
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

  const arrayBufferToLink = (buf: ArrayBuffer) => {
    console.log("arrayBufferToLink");
    const uint8Array = new Uint8Array(buf);
    const blob = new Blob([uint8Array]);
    const srcBlob = URL.createObjectURL(blob);
    return srcBlob;
  };

  const bufferToLink = (buf: Buffer) => {
    console.log("BufferToLink");
    const blob = new Blob([buf]);
    const srcBlob = URL.createObjectURL(blob);
    return srcBlob;
  };

  useEffect(() => {
    if (!roomName) return;
    pullChatHistory(roomName);
  }, [roomName]);

  useEffect(() => {
    if (!chatDisplayRef.current) return;
    chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight; // auto scroll to bottom of chat display
  }, [currentChatroomState]);

  return (
    <div className="innerChatBox">
      <Chatboxheader />
      <div className="chatDisplay" ref={chatDisplayRef}>
        {/* This is where all chat messages from current room are displayed */}
        {/* if the message is a system message then we append a special kind of message div, otherwise append normal message */}
        {currentChatroomState.reduce((messages: ReactElement[], currMessage: Chat, index) => {
          const chat = currMessage;
          if (chat.username === "System" && typeof chat.message === "string") {
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
            Buffer.isBuffer(chat.message)
          ) {
            let srcBlob = null;
            if (chat.message instanceof ArrayBuffer) {
              srcBlob = arrayBufferToLink(chat.message);
            } else {
              console.log("else should hit");
              srcBlob = bufferToLink(chat.message);
            }
            messages.push(
              <div key={index} className="userMessage">
                <span
                  data-value={chat.username}
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
          } else if (typeof chat.message === "string") {
            messages.push(
              <div key={index} className="userMessage">
                <span
                  data-value={chat.username}
                  className="usernameDisplay"
                  onClick={startDM}
                >
                  {chat.username}
                </span>
                <span className="messageDisplay">{chat.message}</span>
              </div>
            );
          } else {
            throw new Error("Invalid message type");
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
          ref={imageInputRef}
          accept=".png, .jpg, .jpeg"
          onChange={(e) => {
            if (!e.target.files || e.target.files.length === 0) return;
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
