import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import Profile from './Prof.js';
import "./styles/Profile.scss";

const root = createRoot(document.getElementById('profile'));
root.render(
    // <React.StrictMode>
    <BrowserRouter>
        <Profile />
    </BrowserRouter>
    // </React.StrictMode>
);