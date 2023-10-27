import React, { ReactElement, MouseEvent } from "react";
import { useEffect, useContext, useState, useRef } from "react";
import '../styles/style.css';
import Chatboxheader from "./Chatboxheader.tsx";
import { SocketContext } from "../Context.ts";
import { useSelector } from "react-redux";
import { Chat } from "../util/chatroomReducer.ts";
import { RootState } from "../util/store.ts";

function Chatbox() {
    const { socket } = useContext(SocketContext);
    const [userMessage, setUserMessage] = useState(''); //* message input field
    const chatDisplayRef = useRef<HTMLDivElement>(null);

    const roomName = useSelector((state: RootState) => state.chatroomReducer.currentChatroom); //* get current room name
    const currentChatroomState = useSelector((state: RootState) => state.chatroomReducer.currentChatroomState); //* get current room state, that being all messages in the room
    const username = useSelector((state: RootState) => state.chatroomReducer.username); //* get username from redux store
    const defaultProfilePic = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png'

    const handleSendBtnClicked = () => {
        if (userMessage?.length > 0) {
            socket.emit('message', { message: userMessage }); //* send message to server
            // console.log("Socket pushed: ", userMessage);
            setUserMessage(''); //* clear input field
        }
    }

    const startDM = (e: MouseEvent<HTMLImageElement>) => {
        const targetUser = e.currentTarget.getAttribute('data-username'); //* get username of user clicked on, getAttribute comes from React
        if (targetUser === username) {
            // console.log("Cannot DM self");
            return; //* if user clicks on their own username, do nothing (cannot DM self)
        }
        // console.log("DM username: ", username);
        socket.emit('startDM', { username: targetUser });
    }

    useEffect(() => {
        if (chatDisplayRef.current) {
            chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight; // auto scroll to bottom of chat display
        }
    }, [currentChatroomState]);
    
    return (
        <div className="innerChatBox">
            <Chatboxheader />
            <div className="chatDisplay" ref={chatDisplayRef}>
                {/* This is where all chat messages from current room are displayed */}
                {/* if the message is a system message then we append a special kind of message div, otherwise append normal message */}
                {currentChatroomState.reduce((messages: ReactElement[], currMessage: Chat, index: number) => {
                    const chat = currMessage;
                    
                    if (chat.message instanceof ArrayBuffer) {
                      chat.message = chat.message.toString();
                      messages.push(<img key={index} src={chat.message} alt="image" />)
                    } else if (chat.username === 'System') {
                        messages.push(<div key={index} className="systemMessage">{chat.message}</div>)
                    } else {
                        messages.push(
                            <div key={index} className="userMessage">
                                <span
                                    className="profilePictureDisplay"
                                >
                                    <img
                                        data-username={chat.username}
                                        style={{
                                            display: 'inline', 
                                            minWidth: '70px', 
                                            height: '70px',
                                            borderRadius: '50%',
                                        }}
                                        onClick={startDM}
                                        src={currMessage.userProfilePic ? currMessage.userProfilePic : defaultProfilePic} 
                                        alt="profile pic"
                                        className="profilePic" 
                                    />
                                </span>
                                <span className="messageDisplay">
                                    <span className="usernameDisplay">{chat.username}</span>: {chat.message}
                                </span>
                            </div>
                        )
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