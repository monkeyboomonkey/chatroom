import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import store from "./util/store";
import { Provider } from "react-redux";
const rootElement = document.getElementById("root");
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(Provider, { store: store },
        React.createElement(App, null)));
}
//# sourceMappingURL=index.js.map