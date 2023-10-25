import React from "react";
import { useEffect, useContext, useState, useRef } from "react";
import '../styles/style.css';
import Chatboxheader from "./Chatboxheader.jsx";
import { SocketContext } from "../Context";
import { useSelector, useDispatch } from "react-redux";
import { addNewChat, setCurrentChatroom, addCategory } from "../util/chatroomReducer.ts";

function Chatbox() {
    const { socket } = useContext(SocketContext);
    const [userMessage, setUserMessage] = useState(''); // message input field
    const [userImageMessage, setUserImageMessage] = useState('')
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
        if(userImageMessage.name){
            socket.emit('message',{ message : userImageMessage })
            setUserImageMessage("");
        }
    }
    
    const handleReceiveMessage = (data) => {
        
        const { username, message } = data;
        console.log("Socket pulled", data)
        dispatch(addNewChat({ username, message }));
        chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
        
    }

    const startDM = (e) => {
        const username = e.target.getAttribute('value'); // get username of user clicked on, getAttribute comes from React
        // console.log("DM username: ", username);
        socket.emit('startDM', { username: username });
    }


    const handleDMStarted = (data) => {
        const { roomName, users } = data;
        console.log(roomName, users);
        dispatch(setCurrentChatroom(roomName));
    }

    const handleSystemMessage = (data) => {
        console.log(data)
        dispatch(addNewChat({ username: 'System', message: data.message }));
    }

    useEffect(() => {
        socket.on('message', handleReceiveMessage); // listen for new messages
        socket.on('startDM', handleDMStarted); // listen for new messages
        socket.on('systemMessage', handleSystemMessage); // listen for system messages (when user is added to a new room
        return () => {
            socket.off('systemMessage', handleSystemMessage);
            socket.on('startDM', handleDMStarted);
            socket.off('message', handleReceiveMessage);
        }
    }, [socket]);

    return (
        <div className="innerChatBox">
            <Chatboxheader roomName={roomName} />
            <div className="chatDisplay" ref={chatDisplayRef}>
                {currentChatroomState.reduce((messages, currMessage, index) => {
                    const chat = currMessage;
                    if (chat.username === 'System') {
                        messages.push(<div key={index} className="systemMessage">{chat.message}</div>)
                    }else if(chat.message instanceof ArrayBuffer){
                        const blob = new Blob([chat.message]);
                        const srcBlob = URL.createObjectURL(blob);
                        messages.push(<div key={index} className="userMessage">
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
                            <img className="chatImage" src={srcBlob}></img>
                        </span>
                    </div>)
                    }
                    else {
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
                    className="messageContent"
                    onChange={(e) => setUserMessage(e.target.value)}
                    value={userMessage}
                />
                <input type="file" onChange={(e)=>setUserImageMessage(e.target.files[0])}/>
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