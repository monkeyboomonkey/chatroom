import React from "react";
import Chatcategory from "./Chatcategory";
import Chatbox from "./Chatbox";

function Chatboard() {
    
    return (
        <div>
            <div className="chatCategory">
                <Chatcategory />
            </div>
            <div className="chatBox">
                <Chatbox />
            </div>
        </div>
    );
}

export default Chatboard;