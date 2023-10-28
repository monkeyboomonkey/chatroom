import React from 'react';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Main from "./components/Main";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import Update from "./components/Update";
import './styles/App.scss';
import AuthProvider from './components/AuthProvider';
import Chatboard from './components/Chatboard';
function App() {
    return (React.createElement(BrowserRouter, null,
        React.createElement(Routes, null,
            React.createElement(Route, { path: "/", element: // this is the main parent route, which will render the Main component, which renders an Outlet, which is a placeholder for the child routes of the parent route.
                React.createElement(AuthProvider, null,
                    React.createElement(Main, null)) },
                React.createElement(Route, { index: true, element: // index element is the default route for the parent route
                    React.createElement(Chatboard, null) }),
                React.createElement(Route, { path: "profile", element: React.createElement(Profile, null) }),
                React.createElement(Route, { path: "update", element: React.createElement(Update, null) })),
            " ",
            React.createElement(Route, { path: "/signup", element: React.createElement(Signup, null) }),
            React.createElement(Route, { path: "/login", element: React.createElement(Login, null) }))));
}
export default App;
//# sourceMappingURL=App.js.map