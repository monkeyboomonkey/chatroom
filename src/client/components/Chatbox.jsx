import React from "react";
import { useRef, useState } from "react";
import '../styles/style.css';
import Chatboxheader from "./Chatboxheader";

// import { io } from "socket.io-client";
// const socket = io('ws://localhost:3001');

function Chatbox(props) {
    // const [roomName, setRoomName] = useState('');
    const chatDisplayRef = useRef(null);
    const messageContentRef = useRef(null);
    // socket.on('switchroom', (data) => {
    //     console.log(`receiving data from server...`);
    //     setRoomName(data);
    // });
    const handleSendBtnClicked = () => {
        const message = messageContentRef.current.value;
        const messageDiv = document.createElement('div');
        messageDiv.innerText = message;
        chatDisplayRef.current.appendChild(messageDiv);
        messageContentRef.current.value = '';
    }
    return (
        <div>
            {/* {props.roomName && <h3>Welcome to room #{props.roomName}!</h3>} */}
            <Chatboxheader roomName={props.roomName} />
            <div className="chatDisplay" ref={chatDisplayRef}></div>
            <div className="chatControl">
                <textarea type="text" className="messageContent" ref={messageContentRef}/>
                <button className="sendBtn" onClick={handleSendBtnClicked}>Send</button>
            </div>
        </div>
    );
}

export default Chatbox;