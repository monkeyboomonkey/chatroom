import React from 'react';
import Chatboard from "./Chatboard.jsx";

function Main(props) {
    console.log('rendering Main')
    return (
        <Chatboard user={props.user} />
    )
}

export default Main;