import React from "react";
import { useRef, useState, useEffect, useContext } from "react";
import '../styles/style.css';
import Chatboxheader from "./Chatboxheader";
import { SocketContext, UserContext } from "../Context";


function Chatbox(props) {
    // const [roomName, setRoomName] = useState('');
    // const isRerender = useRef(false);
    const { socket } = useContext(SocketContext);
    // const userState = useContext(UserContext);
    // console.log(userState);

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
        if (message.length > 0) {
            socket.emit('message', {
                // username: `props.username`, message: message
                username: props.user.username ? props.user.username : "anonymous", message: message
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
            if (!chatDisplayRef.current) {
                chatDisplayRef.current = document.createElement('div');
                chatDisplayRef.current.classList.add('chatDisplay');
            }
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