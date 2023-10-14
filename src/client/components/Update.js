import React, { useState, useEffect, useContext } from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import '../styles/Profile.scss'


function Update(props) {
    const navigate = useNavigate();
    const [userid, setUserID] = useState(props.user.userid);
    const [username, setUsername] = useState(props.user.username);
    const [password, setPassword] = useState();
    const [firstName, setFirstName] = useState(props.user.fn);
    const [lastName, setLastName] = useState(props.user.ln);
    const [email, setEmail] = useState(props.user.email);
    const test = () => {
        console.log(props.user.fn)
    }
    let fullName = `${firstName} ${lastName}`
    let emailAddress = `${email}`

    function toMain() {
        navigate("/")
    }
    function toProfile() {
        navigate("/profile")
    }

    // { fn: "Jane", ln: "Doe", email: "janedoe@yahoo.com", password: "$2a$10$KDBSkhYSw5nQiN2P/9/G7uXHLe9eFMazEcWVn1fY39hC129HJWMRq", username: "user1" }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const updateData = {
            userid: userid,
            newfn: firstName,
            newln: lastName,
            newemail: email,
            newusername: username
            // newpassword: password
        }
        try {
            fetch('http://localhost:3001/api/updateuser', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData),
                credentials: 'include',
                mode: "cors",
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Update complete')
                    console.log(data)
                    const newUserinfo = { ...data }
                    props.setUser(newUserinfo);
                })
                .then(() => {
                    navigate("/profile")
                })



        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div class="card-container">
            <img class="round" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpaiczmKCa_Gd7MeORuu_nN7mUxR9we2h5Xc3sY-ZAjYBwhz0knH63sq77l9BM6GULDmE&usqp=CAU" alt="user" />
            <div class="nuform">
                <form onSubmit={handleSubmit}>
                    <label>
                        <input type="text" placeholder="First name" onChange={el => setFirstName(el.target.value)} />
                    </label>
                    <label>
                        <input type="text" placeholder="Last name" onChange={el => setLastName(el.target.value)} />
                    </label>
                    <label>
                        <input type="text" placeholder="Email" onChange={el => setEmail(el.target.value)} />
                    </label>
                    <label>
                        <input type="text" placeholder="Username" onChange={el => setUsername(el.target.value)} />
                    </label>
                    <label>
                        <input type="password" placeholder="Password" onChange={el => setPassword(el.target.value)} />
                    </label>
                </form>
            </div>
            <div class="buttons">
                <button class="primary" onClick={handleSubmit}>
                    Submit
                </button>
                <button class="primary ghost" onClick={toProfile}>
                    Return
                </button>
            </div>
            <div class="interests">
                <h6>Interests</h6>
                <ul>
                    <li>UI / UX</li>
                    <li>Dungeons & Dragons</li>
                    <li>Vegan recipes</li>
                    <li>Dogs</li>
                    <li>FIFA</li>
                    <li>Yoga</li>
                    <li>Calligraphy</li>
                </ul>
            </div>
            <div class="return">
                <button class="return" onClick={toMain}>
                    Return to Chat
                </button>
            </div>
        </div>

    )

}

export default Update;