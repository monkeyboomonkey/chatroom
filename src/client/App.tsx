import React from 'react';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Main from "./components/Main.tsx";
import Login from "./components/Login.tsx";
import Signup from "./components/Signup.tsx";
import Profile from "./components/Profile.tsx";
import Update from "./components/Update.tsx";
import './styles/App.scss'
import AuthProvider from './components/AuthProvider.tsx';
import Chatboard from './components/Chatboard.tsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ // this is the main parent route, which will render the Main component, which renders an Outlet, which is a placeholder for the child routes of the parent route.
          <AuthProvider>
            <Main />
          </AuthProvider>
        }>
          <Route index element={ // index element is the default route for the parent route
            <Chatboard />
        }/>
          <Route path="profile" element={
              <Profile />
          }/>
          <Route path="update" element={
            <Update />
        }/>
        </Route> {/* end of main parent route */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;