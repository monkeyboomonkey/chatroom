import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import { SocketContext, socket } from "./Context.js";
import { Provider } from 'react-redux';
import store from './store'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
