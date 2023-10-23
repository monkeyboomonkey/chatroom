import React from "react";
import { useEffect, useContext, useState, useRef } from "react";
import '../styles/style.css';
import Chatboxheader from "./Chatboxheader.jsx";
import { SocketContext } from "../Context";
import { useSelector, useDispatch } from "react-redux";
import { addNewChat } from "../chatroomReducer";

function Chatbox() {
    const { socket } = useContext(SocketContext);
    const [ userMessage, setUserMessage ] = useState(''); // message input field
    const chatDisplayRef = useRef(null);
    const dispatch = useDispatch();
    const roomName = useSelector(state => state.chatroomReducer.currentChatroom); // get current room name
    const currentChatroomState = useSelector(state => state.chatroomReducer.currentChatroomState); // get current room state, that being all messages in the room

    const handleSendBtnClicked = () => {
        if (userMessage?.length > 0) {
            socket.emit('message', { message: userMessage }); // send message to server
            console.log("Socket pushed: ", userMessage);
            setUserMessage(''); // clear input field
        }
    }

    const handleReceiveMessage = (data) => {
        const { username, message } = data;
        console.log("Socket pulled", data)
        dispatch(addNewChat({ username, message }));
        chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
    }

    useEffect(() => {
        socket.on('message', handleReceiveMessage); // listen for new messages
        return () => {
            socket.off('message', handleReceiveMessage); // remove listener when component unmounts (cleanup)
        }
    }, [socket]);

    return (
        <div className="innerChatBox">
            <Chatboxheader roomName={roomName} />
            <div className="chatDisplay" ref={chatDisplayRef}>
                    {currentChatroomState.map((chat, index) => (
                        <div key={index} className="userMessage">
                            <span className="usernameDisplay">{chat.username}</span>
                            <span className="messageDisplay">{chat.message}</span>
                        </div>
                    ))}
            </div>
            <div className="chatControl">
                <textarea 
                    disabled={roomName === null ? true : false} 
                    type="text" 
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