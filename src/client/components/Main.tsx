import React, { useContext, useEffect, useRef, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { io } from "socket.io-client";
import { SocketContext } from "../Context.ts";
import { setCurrentCategories, addNewChat, setCurrentChatroom, addCategory } from "../util/chatroomReducer.ts";
import { RootState } from "../util/store.ts";
import "../styles/Main.scss"

interface UserData {
    username: string, 
    message: string, 
    userProfilePic?: string
}

interface DirectMessageData {
    roomName: string, 
    users: string[]
}

const mainContainerContext = createContext({navigateTo: (path: string, cb?: Function): void => {}});
function Main() {
    const username = useSelector((state: RootState) => state.chatroomReducer.username);

    const dispatch = useDispatch();
    const socket = io("ws://localhost:3001", { autoConnect: false, query: { username: username || "anon" }, reconnection: false });
    const navigate = useNavigate();
    
    const authStatus = useSelector((state: RootState) => state.chatroomReducer.isAuth);
    const mainContainerRef = useRef<HTMLDivElement>(null);

    /**
     * This function will navigate to the path passed in, and run the callback function passed in after navigating
     * @param {string} path - path to navigate to
     * @param {Function} cb - (OPTIONAL) function to run after navigating
     * 
     * @returns {void}
     */
    const navigateTo = (path: string, cb?: Function) => {
        if (!mainContainerRef.current) return;
        mainContainerRef.current.classList.add("animateOut");
        setTimeout(() => {
            navigate(path);
            if (cb) cb();
            if (!mainContainerRef.current) return;
            mainContainerRef.current.classList.remove("animateOut");
        }, 1000);
    }
    

    /**
     * This function will handle the data received from the server when the socket connects and future rooms data
     * @param {Array} data - array of strings, each string is a room name
    */
    const handleRoomsData = (data: string[]) => {
        // console.log("Rooms Data:", data);
        dispatch(setCurrentCategories(data));
    };

    const handleReceiveMessage = (data: UserData) => {
        const { username, message, userProfilePic } = data;
        // console.log("Socket pulled", data)
        dispatch(addNewChat({ username, message, userProfilePic }));
    }

    const handleSingleRoomData = (data: string) => {
        // console.log("Single Room Data:", data);
        dispatch(addCategory(data));
    }

    const handleDMStarted = (data: DirectMessageData) => {
        const { roomName, users } = data;
        // console.log(roomName, users);
        dispatch(setCurrentChatroom(roomName));
    }

    const handleSystemMessage = (data: UserData) => {
        // console.log(data)
        dispatch(addNewChat({ username: 'System', message: data.message }));
    }

    const setListeners = () => {
        socket.on('message', handleReceiveMessage); // listen for new messages
        socket.on('startDM', handleDMStarted); // listen for new messages
        socket.on('systemMessage', handleSystemMessage); // listen for system messages (when user is added to a new room
        socket.on("rooms", handleRoomsData);
        socket.on("singleRoom", handleSingleRoomData);
    }
    
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
       if ((authStatus !== null && authStatus !== false) && (!socket.connected && username?.length)) {
           setListeners();
           socket.connect();
        } else if (authStatus === false) {
            socket.disconnect();
        }
        return () => {
            socket.disconnect();
            socket.off("singleRoom", handleSingleRoomData)
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
        }
    });
    // Outlet is a placeholder for the child routes of the parent route, any child routes will be rendered here, defaulted to index aka Chatboard
    return (
        <div ref={mainContainerRef} className='outerContainerMain'>
            {/* authCheck needs to come before render of Outlet, otherwise socket might not connect in time, resulting in weird behavior */}
            {authStatus === null || !username?.length ? 
                <div className='innerContainerMain'>
                    <h1 className='loading'>Loading...</h1>
                </div> :
                <SocketContext.Provider value={{ socket: socket }}>
                    <mainContainerContext.Provider value={{ navigateTo }}>
                        <Outlet />
                    </mainContainerContext.Provider>
                </SocketContext.Provider>}
        </div>
    )
}

/**
 * 
 * @returns {Function} navigateTo - function to navigate to a path with optional callback function
 */
export const useNavigateTo = () => {
    const { navigateTo } = useContext(mainContainerContext);
    return navigateTo;
}

export default Main;