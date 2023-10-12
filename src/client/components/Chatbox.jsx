import React from "react";
import { useRef, useState, useEffect } from "react";
import '../styles/style.css';
import Chatboxheader from "./Chatboxheader";


function Chatbox(props) {
    // const [roomName, setRoomName] = useState('');
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
        // messageContentRef.current.value = '';
        props.socket.emit('message', {
            username: `${props.socket.id}`, message: message
        })
        console.log("Socket pushed")
    }
    useEffect(() => {
        props.socket.on('message', (data) => {
            console.log("Socket pulled")
            const receivedMessageDiv = document.createElement('div');
            receivedMessageDiv.innerText = `${data.message.username}: ${data.message.message}`;


            chatDisplayRef.current.appendChild(receivedMessageDiv);

        })
        console.log("Useffect Refresh")
    }, [])
    return (
        <div>
            {/* {props.roomName && <h3>Welcome to room #{props.roomName}!</h3>} */}
            <Chatboxheader roomName={props.roomName} />
            <div className="chatDisplay" ref={chatDisplayRef}></div>
            <div className="chatControl">
                <textarea type="text" className="messageContent" ref={messageContentRef} />
                <button className="sendBtn" onClick={handleSendBtnClicked}>Send</button>
            </div>
        </div>
    );
}

export default Chatbox;