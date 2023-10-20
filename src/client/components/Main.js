import React from 'react';
import Chatboard from "./Chatboard.jsx";

function Main({ user }) {
    return (
        <Chatboard user={user} />
    )
}

export default Main;