import { useRef } from "react";
import React from "react";

function Chatroom({ switchRoom, id }) {
    const chatRoomRef = useRef(null);
    const handleChatroomClicked = () => {
        const allChatRooms = document.querySelectorAll('.chatroom');
        for (const chatroom of allChatRooms) {
            chatroom.classList.remove('activeRoom');
        }
        chatRoomRef.current.classList.add('activeRoom');
        switchRoom(id);
    }
    return (
        <div className="chatroom" onClick={handleChatroomClicked} ref={chatRoomRef}>
            <h3>Room #{id}</h3>
        </div>
    );
}

export default Chatroom;