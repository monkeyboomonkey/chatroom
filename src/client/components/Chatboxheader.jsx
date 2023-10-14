import React from 'react';
import '../styles/style.css';

function Chatboxheader(props) {

    return (
        <div>
            {props.roomName !== '' ? <h3>Welcome to room #{props.roomName}</h3> : <h3>You're in the lobby. Create or pick a room to chat!</h3>}
        </div>
    );
}

export default Chatboxheader;