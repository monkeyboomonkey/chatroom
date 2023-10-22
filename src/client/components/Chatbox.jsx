import React from "react";
import { useRef, useEffect, useContext } from "react";
import '../styles/style.css';
import Chatboxheader from "./Chatboxheader.jsx";
import { SocketContext } from "../Context";
import { useSelector } from "react-redux";

function Chatbox() {
    const { socket } = useContext(SocketContext);
    const chatDisplayRef = useRef(null);
    const messageContentRef = useRef(null);
    const roomName = useSelector(state => state.currentChatroom);

    const handleSendBtnClicked = () => {
        const message = messageContentRef.current.value;
        messageContentRef.current.value = '';
        if (message.length > 0) {
            socket.emit('message', {
                message: message
            });
            console.log("Socket pushed", message)
        }
    }
    
    useEffect(() => {
        socket.on('message', (data) => {
            const { username, message } = data;
            console.log("Socket pulled", data)
            const receivedMessageDiv = document.createElement('div');
            receivedMessageDiv.classList.add('userMessage');
            receivedMessageDiv.innerHTML = `<span class='usernameDisplay'>${username}</span> <span class='messageDisplay'>${message.message}</span>`;
            if (!chatDisplayRef.current) {
                chatDisplayRef.current = document.createElement('div');
                chatDisplayRef.current.classList.add('chatDisplay');
            }
            chatDisplayRef.current.appendChild(receivedMessageDiv);
            chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
        });
        return () => {
            socket.off('message', (data) => {
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
            });
        }
    }, []);

    return (
        <div className="innerChatBox">
            <Chatboxheader roomName={roomName} />
            <div className="chatDisplay" ref={chatDisplayRef}></div>
            <div className="chatControl">
                <textarea disabled={roomName === null ? true : false} type="text" className="messageContent" ref={messageContentRef} />
                <button disabled={roomName === null ? true : false} className="sendBtn" onClick={handleSendBtnClicked}>Send</button>
            </div>
        </div>
    );
}

export default Chatbox;