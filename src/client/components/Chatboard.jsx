import React from "react";
import { useState, useEffect } from "react";
import Chatcategory from "./Chatcategory";
import Chatbox from "./Chatbox";
import '../styles/style.css';
import { io } from "socket.io-client";
// const socket = io('ws://localhost:3001');

function Chatboard() {
    let [socket, setSocket] = useState(io('ws://localhost:3001'));

    const [roomName, setRoomName] = useState('');
    const handleSwitchRoom = (roomName) => {
        setRoomName(roomName);

    }
    return (
        <div className="chatboard">
            <div className="chatCategory">
                <Chatcategory handleSwitchRoom={handleSwitchRoom} />
            </div>
            <div className="chatBox">
                <Chatbox roomName={roomName} socket={socket} />
            </div>
        </div>
    );
}

export default Chatboard;