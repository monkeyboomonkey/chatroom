import { createContext, useState } from "react";
import { io } from "socket.io-client";

// Socket Context
export const SocketContext = createContext();
export const socket = io("ws://localhost:3001");
socket.on('message', (data) => {
    console.log("Received Message")
    const receivedMessageDiv = document.createElement('div');
    // receivedMessageDiv.innerText = `${data.message.username}: ${data.message.message}`;
    receivedMessageDiv.classList.add('userMessage');
    receivedMessageDiv.innerHTML = `<span class='usernameDisplay'>${data.message.username}</span> <span class='messageDisplay'>${data.message.message}</span>`;
    // console.log(receivedMessageDiv);
    // console.log("CHAT DISPLAY REF")
    // console.log(chatDisplayRef)
    // chatDisplayRef.current.appendChild(receivedMessageDiv);
    const chatDisplayDiv = document.querySelector('.chatDisplay');
    console.log(chatDisplayDiv)
    console.log(receivedMessageDiv);
    chatDisplayDiv.appendChild(receivedMessageDiv);
})


export const UserContext = createContext();
console.log("Context Imported");