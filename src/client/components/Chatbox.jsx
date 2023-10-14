import React from "react";
import { useRef, useState, useEffect, useContext } from "react";
import '../styles/style.css';
import Chatboxheader from "./Chatboxheader";
import { SocketContext } from "../Context";


function Chatbox(props) {
    // const [roomName, setRoomName] = useState('');
    const { socket } = useContext(SocketContext);
    const chatDisplayRef = useRef(null);
    const messageContentRef = useRef(null);
    // socket.on('switchroom', (data) => {
    //     console.log(`receiving data from server...`);
    //     setRoomName(data);
    // });
    console.log("chatbox refresh")
    const handleSendBtnClicked = () => {
        const message = messageContentRef.current.value;
        // const messageDiv = document.createElement('div');
        // messageDiv.innerText = message;
        // chatDisplayRef.current.appendChild(messageDiv);
        messageContentRef.current.value = '';
        if (message.length > 0){
            socket.emit('message', {
                username: `${socket.id.substring(0,4)}`, message: message
            })
            console.log("Socket pushed")
        }
    }
    useEffect(() => {
        socket.on('message', (data) => {
            console.log("Socket pulled")
            const receivedMessageDiv = document.createElement('div');
            // receivedMessageDiv.innerText = `${data.message.username}: ${data.message.message}`;
            receivedMessageDiv.classList.add('userMessage');
            receivedMessageDiv.innerHTML = `<span class='usernameDisplay'>${data.message.username}</span> <span class='messageDisplay'>${data.message.message}</span>`;
            chatDisplayRef.current.appendChild(receivedMessageDiv);
        })
        console.log("Useffect Refresh")
    }, [])
    return (
        <div>
            {/* {props.roomName && <h3>Welcome to room #{props.roomName}!</h3>} */}
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