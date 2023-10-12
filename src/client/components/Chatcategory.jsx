import React from "react";
import Chatroom from "./Chatroom";
import { useEffect } from "react";

function Chatcategory(props) {
    useEffect(() => {
        props.socket.on('rooms', (data) => {
            console.log(data);
        })

    }, [])

    const handleSwitchRoomEvent = (id) => {
        console.log(`Switching to room: ${id}`);
        // socket.emit('switchroom', id);
        props.handleSwitchRoom(id);
        props.socket.emit('joinRoom', id);
    }
    
    return (
        <div>
            <h3>Let's chat!!!</h3>
            <div className="allChatCategories">
                {props.categories.map((chatroom, index) => <Chatroom key={index} id={chatroom} switchRoom={handleSwitchRoomEvent}/>)}
            </div>
        </div>
    );
}

export default Chatcategory;