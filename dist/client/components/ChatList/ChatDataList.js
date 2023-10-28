import React, { useContext, useState } from "react";
import { SocketContext } from "../../Context";
export function ChatDataList() {
    const { socket } = useContext(SocketContext);
    const [newRoomName, setNewRoomName] = useState(""); // to be used for creating new room
    const handleSubmit = (e) => {
        e.preventDefault();
        const newRoom = newRoomName;
        setNewRoomName("");
        socket.emit("joinRoom", newRoom);
    };
    return (React.createElement("div", { className: "formContainer" },
        React.createElement("form", { onSubmit: handleSubmit },
            React.createElement("div", { className: "roomForm" },
                React.createElement("input", { list: "roomlist", id: "roomName", name: "Room", value: newRoomName, onChange: (e) => setNewRoomName(e.target.value), placeholder: "Join or create a room" }),
                React.createElement("input", { id: "joinRoomButton", type: "submit", value: "Join" })))));
}
//# sourceMappingURL=ChatDataList.js.map