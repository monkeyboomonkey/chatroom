import React from 'react';
import Chatboard from "./Chatboard.jsx";

function Main(props) {
    return (
        <Chatboard user={props.user} />
    )
}

export default Main;