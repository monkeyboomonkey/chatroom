import React from "react";
import { useEffect, useContext, useState, useRef } from "react";
import '../styles/style.css';
import Chatboxheader from "./Chatboxheader.jsx";
import { SocketContext } from "../Context";
import { useSelector } from "react-redux";

function Chatbox() {
    const { socket } = useContext(SocketContext);
    const [userMessage, setUserMessage] = useState(''); //* message input field
    const chatDisplayRef = useRef(null);
    const roomName = useSelector(state => state.chatroomReducer.currentChatroom); //* get current room name
    const currentChatroomState = useSelector(state => state.chatroomReducer.currentChatroomState); //* get current room state, that being all messages in the room
    const username = useSelector(state => state.chatroomReducer.username); //* get username from redux store

    const handleSendBtnClicked = () => {
        if (userMessage?.length > 0) {
            socket.emit('message', { message: userMessage }); //* send message to server
            console.log("Socket pushed: ", userMessage);
            setUserMessage(''); //* clear input field
        }
    }

    const startDM = (e) => {
        console.log(username)
        if (e.target.getAttribute('value') === username) {
            console.log("Cannot DM self");
            return; //* if user clicks on their own username, do nothing (cannot DM self)
        }
        const targetUser = e.target.getAttribute('value'); //* get username of user clicked on, getAttribute comes from React
        // console.log("DM username: ", username);
        socket.emit('startDM', { username: targetUser });
    }

    useEffect(() => {
        chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight; // auto scroll to bottom of chat display
    }, [currentChatroomState]);
    
    return (
        <div className="innerChatBox">
            <Chatboxheader roomName={roomName} />
            <div className="chatDisplay" ref={chatDisplayRef}>
                {currentChatroomState.reduce((messages, currMessage, index) => {
                    const chat = currMessage;
                    if (chat.username === 'System') {
                        messages.push(<div key={index} className="systemMessage">{chat.message}</div>)
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
                                <span
                                    className="messageDisplay"
                                >
                                    {chat.message}
                                </span>
                            </div>
                        )
                    }
                    return messages;
                }, [])}
            </div>
            <div className="chatControl">
                <textarea
                    disabled={roomName === null ? true : false}
                    type="text"
                    id="messageInput"
                    className="messageContent"
                    onChange={(e) => setUserMessage(e.target.value)}
                    value={userMessage}
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