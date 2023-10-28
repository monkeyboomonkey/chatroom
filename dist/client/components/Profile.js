import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigateTo } from './Main';
import '../styles/Profile.scss';
function Profile() {
    const navigateTo = useNavigateTo();
    const firstName = useSelector((state) => state.chatroomReducer.userIdentity.fn);
    const lastName = useSelector((state) => state.chatroomReducer.userIdentity.ln);
    const email = useSelector((state) => state.chatroomReducer.userIdentity.email);
    const image = useSelector((state) => state.chatroomReducer.userIdentity.pictureURL);
    console.log(firstName, lastName, email, image);
    let fullName = `${firstName} ${lastName}`;
    let emailAddress = `${email}`;
    function toMain() {
        navigateTo("/");
    }
    function toUpdate() {
        navigateTo("/update");
    }
    return (React.createElement("div", { className: 'outerContainer' },
        React.createElement("div", { className: "card-container" },
            React.createElement("img", { width: "200", height: "200", className: "round", src: image, alt: "user" }),
            React.createElement("h3", null, fullName),
            React.createElement("h6", null, emailAddress),
            React.createElement("div", { className: "buttons" },
                React.createElement("button", { className: "primary", onClick: toUpdate }, "Update"),
                React.createElement("button", { className: "primary ghost", onClick: () => { } }, "Options")),
            React.createElement("div", { className: "interests" },
                React.createElement("h6", null, "Interests"),
                React.createElement("ul", null)),
            React.createElement("div", { className: "return" },
                React.createElement("button", { className: "return", onClick: toMain }, "Return to Chat")))));
}
export default Profile;
//# sourceMappingURL=Profile.js.map