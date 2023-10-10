import React from "react";
import { useState } from "react";
import Chatcategory from "./Chatcategory";
import Chatbox from "./Chatbox";
import '../styles/style.css';

function Chatboard() {
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
                <Chatbox roomName={roomName} />
            </div>
        </div>
    );
}

export default Chatboard;