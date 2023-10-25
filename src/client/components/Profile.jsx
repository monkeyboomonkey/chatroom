import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigateTo } from './Main';
import '../styles/Profile.scss'

function Profile() {
    const navigateTo = useNavigateTo();
    const firstName = useSelector(state => state.chatroomReducer.userIdentity.fn);
    const lastName = useSelector(state => state.chatroomReducer.userIdentity.ln);
    const email = useSelector(state => state.chatroomReducer.userIdentity.email);   
    const image = useSelector((state) => state.chatroomReducer.pictureURL);
    console.log(image)
    let fullName = `${firstName} ${lastName}`
    let emailAddress = `${email}`

    function toMain() {
        navigateTo("/");
    }
    function toUpdate() {
        navigateTo("/update");
    }

    return (
        <div className='outerContainer'>
            <div className="card-container">
                <img 
                    className="round" 
                    src={image}
                    alt="user" 
                />
                <h3>{fullName}</h3>
                <h6>{emailAddress}</h6>
                <div className="buttons">
                    <button className="primary" onClick={toUpdate}>
                        Update
                    </button>
                    <button className="primary ghost" onClick={() => {}}>
                        Options
                    </button>
                </div>
                <div className="interests">
                    <h6>Interests</h6>
                    <ul>
                    </ul>
                </div>

                <div className="return">
                    <button className="return" onClick={toMain}>
                        Return to Chat
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;