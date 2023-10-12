import React from "react";
import { useState, useEffect, useRef } from "react";
import Chatcategory from "./Chatcategory";
import Chatbox from "./Chatbox";
import '../styles/style.css';
import { io } from "socket.io-client";
// const socket = io('ws://localhost:3001');

function Chatboard() {
    let [socket, setSocket] = useState(io('ws://localhost:3001'));
    const chatBoxRef = useRef(null);
    const newRoomDivRef = useRef(null);
    const newRoomText = useRef(null);
    const [categories, setCategories] = useState([1,2,3,4,5,6]);

    const [roomName, setRoomName] = useState('');
    const handleSwitchRoom = (roomName) => {
        console.log('Handling switch rooooooooom');
        const chatBoxDiv = chatBoxRef.current;
        const chatBoxDisplay = chatBoxDiv.querySelector('.chatDisplay');
        chatBoxDisplay.innerText = '';
        console.log('> > > chatBoxDisplay.value: ', chatBoxDisplay.value);
        console.log('> > > chatBoxDisplay: ', chatBoxDisplay);
        console.log('>>> chatBoxDiv: ', chatBoxDiv);
        setRoomName(roomName);

    }
    const handleNewRoomClicked = () => {
        newRoomDivRef.current.style.display = 'block';

    }
    const handleNewRoomFormSubmit = (e) => {
        const newRoomName = newRoomText.current.value;
        newRoomText.current.value = '';
        newRoomDivRef.current.style.display = 'none';
        console.log('newRoomName: ', newRoomName);
        const updatedCategories = [...categories, newRoomName];
        handleSwitchRoom(newRoomName);
        socket.emit('joinRoom', newRoomName);
        setCategories(updatedCategories);
    }
    return (
        <>
            <div className="chatboard">
                <div className="chatCategory">
                    <div className="chatCategoryList">
                        <Chatcategory handleSwitchRoom={handleSwitchRoom} socket={socket} categories={categories} />
                    </div>
                    <div>
                        <button onClick={handleNewRoomClicked}>New room</button>
                    </div>
                </div>
                <div className="chatBox" ref={chatBoxRef}>
                    <Chatbox roomName={roomName} socket={socket} />
                </div>
            </div>
            <div ref={newRoomDivRef} className="newRoomDiv">
                <form onSubmit={(e) => e.preventDefault()}>
                    <input type="text" placeholder="Enter a topic" ref={newRoomText} />
                    <input type="submit" value="Create" onClick={handleNewRoomFormSubmit}/>
                </form>
            </div>
        </>
    );
}

export default Chatboard;