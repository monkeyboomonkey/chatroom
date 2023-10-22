import React, {useContext, useEffect} from 'react';
import { Outlet } from "react-router-dom";
import { SocketContext } from '../Context';
import { useSelector } from 'react-redux';

function Main() {
    const authStatus = useSelector(state => state.isAuth);
    const { socket } = useContext(SocketContext); // socket comes from the SocketContext, see Context.js, and App.js

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
    }, [authStatus]);
    // Outlet is a placeholder for the child routes of the parent route, any child routes will be rendered here, defaulted to index aka Chatboard
    return (
        <div>
            {/* authCheck needs to come before render of Outlet, otherwise socket might not connect in time, resulting in weird behavior */}
            {authStatus === null ? "Verifying User Please Wait" : <Outlet />} {/* <Outlet /> is a placeholder for the child routes of the parent route. */}
        </div>
    )
}

export default Main;