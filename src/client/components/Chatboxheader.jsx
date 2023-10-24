import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChatroom } from "../util/chatroomReducer.ts";
import { SocketContext } from '../Context';
import '../styles/style.css';

function Chatboxheader() {
    const dispatch = useDispatch();
    const { socket } = useContext(SocketContext);
    const roomName = useSelector(state => state.chatroomReducer.currentChatroom); // get current room name
    const roomActive = roomName?.length || roomName !== null ? true : false; // check if room is active

    const handleLeaveRoom = () => {
        // leave room
        socket.emit('leaveRoom');
        dispatch(setCurrentChatroom(null));
    }

    return (
        <div className="welcometext">
            {roomActive ?
                <div>
                    <h3>Welcome to room #{roomName}</h3>
                    <button className='navButton' onClick={handleLeaveRoom}>Leave Room</button>
                </div> :
                <div>
                    <h3>Create or pick a room to chat!</h3>
                </div>}
        </div>
    );
}

export default Chatboxheader;