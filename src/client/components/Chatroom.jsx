import React from "react";

function Chatroom(props) {
    const handleChatroomClicked = () => {
        console.log('Chatroom clicked!!!');
        props.switchRoom(props.id);
    }
    return (
        <div className="chatroom" onClick={handleChatroomClicked}>
            <h3>I'm the Chatroom #{props.id}</h3>
        </div>
    );
}

export default Chatroom;