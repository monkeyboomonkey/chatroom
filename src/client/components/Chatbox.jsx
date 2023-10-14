import React from "react";
import { useRef, useState, useEffect, useContext } from "react";
import '../styles/style.css';
import Chatboxheader from "./Chatboxheader";
import { SocketContext, StateContext } from "../Context";


function Chatbox(props) {
    // const [roomName, setRoomName] = useState('');
    const { socket } = useContext(SocketContext);
    const chatDisplayRef = useRef(null);
    const messageContentRef = useRef(null);
    const { userState } = useContext(StateContext);
    const [user, setUser] = userState;
    // socket.on('switchroom', (data) => {
    //     console.log(`receiving data from server...`);
    //     setRoomName(data);
    // });
    console.log("chatbox refresh")
    console.log(props.roomName)
    const handleSendBtnClicked = () => {
        const message = messageContentRef.current.value;
        // const messageDiv = document.createElement('div');
        // messageDiv.innerText = message;
        // chatDisplayRef.current.appendChild(messageDiv);
        messageContentRef.current.value = '';
        if (message.trim().length > 0){
            socket.emit('message', {
                username: user.username ? user.username : "anonymous", message: message
            })
            console.log("Socket pushed")
        }
    }
    useEffect(() => {
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