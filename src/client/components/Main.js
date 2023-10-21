import React, { useEffect } from 'react';
import Chatboard from "./Chatboard.jsx";
import { useNavigate } from "react-router-dom";
import { setUser } from "../chatroomReducer.ts";
import { useDispatch } from "react-redux";

function Main({ user }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        console.log("Main rerendered")
        fetch('http://localhost:3001/api/verify', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: "cors",
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to verify user');
            return response.json()
        })
        .then(data => {
            console.log('User Verified:', data);
            dispatch(setUser(data));
        })
        .catch(err => {
            console.log(err);
            navigate('/login');
        });
    }, [])
    return (
        <div>
            <Chatboard user={user} />
        </div>
    )
}

export default Main;