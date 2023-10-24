import React, { useContext, useEffect, useRef, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from "react-router-dom";
import { SocketContext } from '../Context';
import { useSelector } from 'react-redux';
import "../styles/Main.scss"

const mainContainerContext = createContext();
function Main() {
    const navigate = useNavigate();
    const authStatus = useSelector((state) => state.chatroomReducer.isAuth);
    const { socket } = useContext(SocketContext); // socket comes from the SocketContext, see Context.js, and App.js
    const mainContainerRef = useRef(null);

    /**
     * This function will navigate to the path passed in, and run the callback function passed in after navigating
     * @param {string} path - path to navigate to
     * @param {Function} cb - (OPTIONAL) function to run after navigating
     * 
     * @returns {void}
     */
    const navigateTo = (path, cb) => {
        mainContainerRef.current.classList.add("animateOut");
        setTimeout(() => {
            navigate(path);
            if (cb) cb();
            mainContainerRef.current.classList.remove("animateOut");
        }, 1000);
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
        if (authStatus) {
            socket.connect();
            socket.on("connect", () => {
                console.log("Connected to server:", socket.connected);
            });
            socket.on("disconnect", () => {
                console.log("Connected to server:", socket.connected);
                socket.off("connect", () => {
                    console.log("Connected to server:", socket.connected);
                });
                socket.off("disconnect", () => {
                    console.log("Connected to server:", socket.connected);
                });
            });
        } else if (socket.connected) {
            socket.disconnect();
        }
        return () => {
            socket.disconnect();
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
            
            {authStatus === null ? 
                <div className='innerContainerMain'>
                    <h1 className='loading'>Loading...</h1>
                </div> :
                <mainContainerContext.Provider value={{ navigateTo }}>
                    <Outlet />
                </mainContainerContext.Provider>}
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