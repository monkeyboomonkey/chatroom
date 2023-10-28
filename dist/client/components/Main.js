import React, { useContext, useEffect, useRef, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { io } from "socket.io-client";
import { SocketContext } from "../Context";
import { setCurrentCategories, addNewChat, setCurrentChatroom, addCategory } from "../util/chatroomReducer";
import "../styles/Main.scss";
const mainContainerContext = createContext({ navigateTo: (path, cb) => { } });
function Main() {
    const username = useSelector((state) => state.chatroomReducer.username);
    let url = "";
    if (window.location.origin.includes("localhost")) {
        url = "ws://localhost:3001";
    }
    else {
        // url = "ws://" + window.location.host;
        url = "wss://chaxolotl.onrender.com";
    }
    const dispatch = useDispatch();
    const socket = io(url, { autoConnect: false, query: { username: username || "anon" }, reconnection: false });
    const navigate = useNavigate();
    const authStatus = useSelector((state) => state.chatroomReducer.isAuth);
    const mainContainerRef = useRef(null);
    /**
     * This function will navigate to the path passed in, and run the callback function passed in after navigating
     * @param {string} path - path to navigate to
     * @param {Function} cb - (OPTIONAL) function to run after navigating
     *
     * @returns {void}
     */
    const navigateTo = (path, cb) => {
        if (!mainContainerRef.current)
            return;
        mainContainerRef.current.classList.add("animateOut");
        setTimeout(() => {
            navigate(path);
            if (cb)
                cb();
            if (!mainContainerRef.current)
                return;
            mainContainerRef.current.classList.remove("animateOut");
        }, 1000);
    };
    /**
     * This function will handle the data received from the server when the socket connects and future rooms data
     * @param {Array} data - array of strings, each string is a room name
    */
    const handleRoomsData = (data) => {
        dispatch(setCurrentCategories(data));
    };
    const arrayBufferToLink = (buf) => {
        const uint8Array = new Uint8Array(buf);
        const blob = new Blob([uint8Array]);
        const srcBlob = URL.createObjectURL(blob);
        return srcBlob;
    };
    const bufferToLink = (buf) => {
        const blob = new Blob([buf]);
        const srcBlob = URL.createObjectURL(blob);
        return srcBlob;
    };
    const handleReceiveMessage = (data) => {
        const { username, message, userProfilePic } = data;
        const msg = message;
        if (msg instanceof ArrayBuffer || (msg === null || msg === void 0 ? void 0 : msg.type) === "Buffer") {
            if (msg instanceof ArrayBuffer) {
                const url = arrayBufferToLink(msg);
                dispatch(addNewChat({ username, message: { type: 'img', url }, userProfilePic }));
                return;
            }
            else {
                const url = bufferToLink(msg.data);
                dispatch(addNewChat({ username, message: url, userProfilePic }));
                return;
            }
        }
        dispatch(addNewChat({ username, message, userProfilePic }));
    };
    const handleSingleRoomData = (data) => {
        dispatch(addCategory(data));
    };
    const handleDMStarted = (data) => {
        const { roomName, users } = data;
        dispatch(setCurrentChatroom(roomName));
    };
    const handleSystemMessage = (data) => {
        dispatch(addNewChat({ username: 'System', message: data.message }));
    };
    const setListeners = () => {
        socket.on('message', handleReceiveMessage); // listen for new messages
        socket.on('startDM', handleDMStarted); // listen for new messages
        socket.on('systemMessage', handleSystemMessage); // listen for system messages (when user is added to a new room
        socket.on("rooms", handleRoomsData);
        socket.on("singleRoom", handleSingleRoomData);
    };
    /*
    * this effect will run when the component mounts and when the authStatus changes
    * if the authStatus is true, then the socket will connect
    * if the authStatus is false, then the socket will disconnect
    * if the authStatus is null, then the socket will not connect or disconnect
    * returned is the cleanup function, which will disconnect the socket when the component unmounts
    * and will remove the event listeners for connect and disconnect
    */
    useEffect(() => {
        //* set up socket listeners here
        if ((authStatus !== null && authStatus !== false) && (!socket.connected && (username === null || username === void 0 ? void 0 : username.length))) {
            setListeners();
            socket.connect();
        }
        else if (authStatus === false) {
            socket.disconnect();
        }
        return () => {
            socket.disconnect();
            socket.off("singleRoom", handleSingleRoomData);
            socket.off('systemMessage', handleSystemMessage);
            socket.off('startDM', handleDMStarted);
            socket.off('message', handleReceiveMessage);
            socket.off("rooms", handleRoomsData);
            socket.off("connect", () => {
                console.log("Connected to server:", socket.connected);
            });
            socket.off("disconnect", () => {
                console.log("Connected to server:", socket.connected);
            });
        };
    });
    // Outlet is a placeholder for the child routes of the parent route, any child routes will be rendered here, defaulted to index aka Chatboard
    return (React.createElement("div", { ref: mainContainerRef, className: 'outerContainerMain' }, authStatus === null || !(username === null || username === void 0 ? void 0 : username.length) ?
        React.createElement("div", { className: 'innerContainerMain' },
            React.createElement("h1", { className: 'loading' }, "Loading...")) :
        React.createElement(SocketContext.Provider, { value: { socket: socket } },
            React.createElement(mainContainerContext.Provider, { value: { navigateTo } },
                React.createElement(Outlet, null)))));
}
/**
 *
 * @returns {Function} navigateTo - function to navigate to a path with optional callback function
 */
export const useNavigateTo = () => {
    const { navigateTo } = useContext(mainContainerContext);
    return navigateTo;
};
export default Main;
//# sourceMappingURL=Main.js.map