import React from "react";
import { useDispatch } from "react-redux";
import { setIsAuth } from "../util/chatroomReducer";
import { useNavigateTo } from "./Main";
function Navbar() {
    const dispatch = useDispatch();
    const navigateTo = useNavigateTo();
    async function logoutVerifiedUser() {
        try {
            const response = await fetch("api/userlogout", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                console.log("User logged out");
                navigateTo("/login", () => {
                    dispatch(setIsAuth(false));
                });
            }
            else {
                throw new Error("Unknown error occurred while logging out");
            }
        }
        catch (err) {
            console.error(err.message);
        }
    }
    function profile() {
        navigateTo("/profile");
    }
    return (React.createElement("nav", { className: "navbar" },
        React.createElement("div", { className: "leftNav" },
            React.createElement("h2", null, "Chaxolotl")),
        React.createElement("div", { className: "rightNav" },
            React.createElement("ul", null,
                React.createElement("button", { className: "navButton", onClick: profile }, "Profile"),
                React.createElement("button", { className: "navButton", onClick: logoutVerifiedUser }, "Log Out")))));
}
export default Navbar;
//# sourceMappingURL=Navbar.js.map