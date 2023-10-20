import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import { SocketContext, socket } from "./Context.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <SocketContext.Provider value={{ socket: socket }}>
        <App />
    </SocketContext.Provider>
);
