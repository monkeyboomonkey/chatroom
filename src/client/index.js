import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import store from "./store.ts";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
console.log("root");
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
