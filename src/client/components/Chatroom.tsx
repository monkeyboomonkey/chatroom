import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { setCurrentChatroom } from "../util/chatroomReducer";
import { SocketContext } from "../Context";

interface ChatroomProps {
    id: string;
}

function Chatroom({ id }: ChatroomProps) {
    const dispatch = useDispatch();
    const { socket } = useContext(SocketContext);
    const handleSwitchRoom = () => {
        // console.log(`Switching to room: ${id}`);
        dispatch(setCurrentChatroom(id));
        socket.emit("joinRoom", id);
    };
    return (
        <div className="chatroom" onClick={handleSwitchRoom}>
            <h3>Room #{id}</h3>
        </div>
    );
}

export default Chatroom;
