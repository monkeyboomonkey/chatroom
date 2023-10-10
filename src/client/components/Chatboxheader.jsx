import React from 'react';
import '../styles/style.css';

function Chatboxheader(props) {

    return (
        <div>
            {props.roomName !== undefined ? <h3>Welcome to room #{props.roomName}</h3> : <h3>You're in the lobby. Pick your interested room to start chatting!</h3>}
        </div>
    );
}

export default Chatboxheader;