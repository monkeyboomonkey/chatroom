import React from 'react';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Main from "./components/Main";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import Update from "./components/Update";
import './styles/App.scss'
import AuthProvider from './components/AuthProvider';
import Chatboard from './components/Chatboard';


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