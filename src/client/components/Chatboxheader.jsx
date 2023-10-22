import React from 'react';
import '../styles/style.css';

function Chatboxheader({ roomName }) {

    return (
        <div className="welcometext">
            {roomName !== '' ? <h3>Welcome to room #{roomName}</h3> : <h3>You're in the lobby. Create or pick a room to chat!</h3>}
        </div>
    );
}

export default Chatboxheader;