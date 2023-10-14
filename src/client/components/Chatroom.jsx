import { useRef } from "react";
import React from "react";

function Chatroom(props) {
    const chatRoomRef = useRef(null);
    const handleChatroomClicked = () => {
        console.log('Chatroom clicked!!!');
        const allChatRooms = document.querySelectorAll('.chatroom');
        // for(const chatroom of allChatRooms) {
        //     chatroom.classList.remove('activeRoom');
        //     // chatroom.disabled = false;
        //     console.log(chatroom)
        // }
        // chatRoomRef.current.classList.add('activeRoom');
        // chatRoomRef.current.disabled = true;
        // console.log('~~~ charRoomRef.current: ', chatRoomRef.current);
        // console.log('~~~ allChatRooms: ', allChatRooms);
        props.switchRoom(props.id, chatRoomRef.current, allChatRooms);
    }
    return (
        <div className="chatroom" onClick={handleChatroomClicked} ref={chatRoomRef} id={props.id}>
            <h3>#{props.id}</h3>
        </div>
    );
}

export default Chatroom;