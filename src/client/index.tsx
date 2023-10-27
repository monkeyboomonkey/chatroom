import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import store from "./util/store.ts";
import { Provider } from "react-redux";

const rootElement = document.getElementById("root");
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <Provider store={store}>
                <App />
        </Provider>
    );
}
