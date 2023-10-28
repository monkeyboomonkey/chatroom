import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChatroom } from "../util/chatroomReducer";
import { SocketContext } from '../Context';
import '../styles/style.css';
const Chatboxheader = () => {
    const dispatch = useDispatch();
    const { socket } = useContext(SocketContext);
    const roomName = useSelector((state) => state.chatroomReducer.currentChatroom); // get current room name
    const roomActive = (roomName === null || roomName === void 0 ? void 0 : roomName.length) || roomName !== null ? true : false; // check if room is active
    const handleLeaveRoom = () => {
        // leave room
        socket.emit('leaveRoom');
        dispatch(setCurrentChatroom(null));
    };
    return (React.createElement("div", { className: "welcometext" }, roomActive ?
        React.createElement("div", null,
            React.createElement("h3", null,
                "Welcome to room #",
                roomName),
            React.createElement("button", { className: 'navButton', onClick: handleLeaveRoom }, "Leave Room")) :
        React.createElement("div", null,
            React.createElement("h3", null, "Create or pick a room to chat!"))));
};
export default Chatboxheader;
//# sourceMappingURL=Chatboxheader.js.map