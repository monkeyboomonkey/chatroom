import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { setCurrentChatroom } from "../util/chatroomReducer";
import { SocketContext } from "../Context";
function Chatroom({ id }) {
    const dispatch = useDispatch();
    const { socket } = useContext(SocketContext);
    const handleSwitchRoom = () => {
        // console.log(`Switching to room: ${id}`);
        dispatch(setCurrentChatroom(id));
        socket.emit("joinRoom", id);
    };
    return (React.createElement("div", { className: "chatroom", onClick: handleSwitchRoom },
        React.createElement("h3", null,
            "Room #",
            id)));
}
export default Chatroom;
//# sourceMappingURL=Chatroom.js.map