import React, { useState, useEffect, useContext } from 'react';
import { Route, Routes, useNavigate, Link, BrowserRouter } from "react-router-dom";
import Main from "./components/Main.js";
import Login from "./components/Login.js";
import Signup from "./components/Signup.js";
import Profile from "./components/Profile.js";
import Update from "./components/Update.js";
import './styles/App.scss'
import { UserContext } from './Context.js';



function App() {
  const navigate = useNavigate();
  // checks to see if verified user exists; redirects to login page if no user exists
  const [user, setUser] = useState({});
  const userValues = [user, setUser]
  const userState = useContext(UserContext);


  


  return (
    <div
    >

    <UserContext.Provider values={userValues}>
      <Routes>
        <Route path="/" element={<Main setUser={setUser} user={user}/>} />
        <Route path="/login" element={<Login setUser={setUser} user={user} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile setUser={setUser} user={user} />} />
        <Route path="/update" element={<Update setUser={setUser} user={user} />} />
      </Routes>
    </UserContext.Provider>
    </div>
  )
}

export default App;


import React, {useState} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SharedLayout from './components/SharedLayout';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Signin from './components/Signin';
import Register from './components/Register';

import Error from './components/Error';
import Dashboard from './components/Dashboard';
import './stylesheets/styles.css';


const App = () => {
  const [user, setUser] = useState(null);

  return (
    
    <BrowserRouter>
      <Routes>
        <Route path = '/' element= {<SharedLayout />}>
          <Route index element = {<Home />}></Route>
          <Route path = 'about'  element = {<About />} />
          <Route path = 'contact' element = {<Contact />} />
          <Route path = 'signin' element = {<Signin setUser = {setUser}/>} />
          <Route path = 'register' element = {<Register setUser = {setUser} />} />
          <Route path = '*' element = {<Error />} />

          <Route path = 'dashboard' element= {<Dashboard user = {user} setUser = {setUser} />}></Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;