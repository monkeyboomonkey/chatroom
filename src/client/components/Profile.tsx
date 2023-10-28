import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigateTo } from './Main';
import '../styles/Profile.scss'
import { RootState } from '../util/store';

function Profile() {
    const navigateTo = useNavigateTo();
    const firstName = useSelector((state: RootState) => state.chatroomReducer.userIdentity.fn);
    const lastName = useSelector((state: RootState) => state.chatroomReducer.userIdentity.ln);
    const email = useSelector((state: RootState) => state.chatroomReducer.userIdentity.email);   
    const image = useSelector((state: RootState) => state.chatroomReducer.userIdentity.pictureURL);
    console.log(firstName, lastName, email, image)
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
                    width={"200"}
                    height={"200"}
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