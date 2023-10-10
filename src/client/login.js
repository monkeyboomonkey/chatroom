import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import Log from './Log.js';
import "./Login.scss";

const root = createRoot(document.getElementById('log'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Log />
        </BrowserRouter>
    </React.StrictMode>
);