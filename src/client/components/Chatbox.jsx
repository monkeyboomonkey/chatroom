import React from "react";
import { useRef, useState, useEffect, useContext } from "react";
import '../styles/style.css';
import Chatboxheader from "./Chatboxheader";
import { SocketContext } from "../Context";

function Chatbox(props) {
    const { socket } = useContext(SocketContext);
    const chatDisplayRef = useRef(null);
    const messageContentRef = useRef(null);
    const handleSendBtnClicked = () => {
        const message = messageContentRef.current.value;
        messageContentRef.current.value = '';
        if (message.length > 0) {
            socket.emit('message', {
                username: props.user.username ? props.user.username : "anonymous", message: message
            });
            console.log("Socket pushed")
        }
    }
    useEffect(() => {
        socket.on('message', (data) => {
            console.log("Socket pulled")
            const receivedMessageDiv = document.createElement('div');
            receivedMessageDiv.classList.add('userMessage');
            receivedMessageDiv.innerHTML = `<span class='usernameDisplay'>${data.message.username}</span> <span class='messageDisplay'>${data.message.message}</span>`;
            if (!chatDisplayRef.current) {
                chatDisplayRef.current = document.createElement('div');
                chatDisplayRef.current.classList.add('chatDisplay');
            }
            chatDisplayRef.current.appendChild(receivedMessageDiv);
            chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
        })
    }, []);

    return (
        <div className="innerChatBox">
            <Chatboxheader roomName={props.roomName} />
            <div className="chatDisplay" ref={chatDisplayRef}></div>
            {props.roomName === '' ? '' : <div className="chatControl">
                <textarea type="text" className="messageContent" ref={messageContentRef} />
                <button className="sendBtn" onClick={handleSendBtnClicked}>Send</button>
            </div>}
        </div>
    );
}

export default Chatbox;