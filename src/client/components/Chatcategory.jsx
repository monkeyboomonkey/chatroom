import React from "react";
import Chatroom from "./Chatroom";
import { useEffect, useContext } from "react";
import { SocketContext } from "../Context";

function Chatcategory(props) {
    const { socket } = useContext(SocketContext);
    const handleSwitchRoomEvent = (id) => {
        console.log(`Switching to room: ${id}`);
        // socket.emit('switchroom', id);
        props.handleSwitchRoom(id);
        socket.emit("joinRoom", id);
    };

    return (
        <div>
            <h3>Let's chat!!!</h3>
            <div className="allChatCategories">
                {props.categories.map((chatroom, index) => (
                    <Chatroom
                        key={index}
                        id={chatroom}
                        switchRoom={handleSwitchRoomEvent}
                    />
                ))}
            </div>
        </div>
    );
}

export default Chatcategory;
