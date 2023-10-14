import React from "react";

function Navbar() {

    return (
        <nav className="navbar">
            <div className="leftNav">
                <h2>Chaxolotl</h2>
            </div>
            <div className="rightNav">
                <ul>
                    <li>Profile</li>
                    <li>Log out</li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;