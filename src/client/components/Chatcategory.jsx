import React from "react";
import Chatroom from "./Chatroom";

import { io } from "socket.io-client";
const socket = io('ws://localhost:3001');

// socket.on('switchroom', (data) => {
//     console.log(`receiving data from server...`);
// });

function Chatcategory() {
    // socket.on('switchroom', (data) => {
    //     console.log(`receiving data from server...`);
    // });
    const fakeChatrooms = [1,2,3,4,5,6];
    const handleSwitchRoomEvent = (id) => {
        console.log(`Switching to room: ${id}`);
        // socket.emit('switchroom', id);
        socket.emit('joinRoom', id);
    }
    return (
        <div>
            <h3>Let's chat!!!</h3>
            <div className="mainChatboard">
                {fakeChatrooms.map((chatroom, index) => <Chatroom key={index} id={chatroom} switchRoom={handleSwitchRoomEvent}/>)}
                
            </div>
        </div>
    );
}

export default Chatcategory;