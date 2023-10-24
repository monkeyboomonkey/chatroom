import React, { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../Context";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [authStatus, dangerouslySetAuthStatus] = useState(localStorage.getItem("authStatus"));
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(() => {
      fetch('http://localhost:3001/api/verify', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        mode: "cors",
      })
      .then(response => response.json())
      .then(data => {

        console.log("Verification response is: ")
        console.log(data)
        if (data !== true) {
          localStorage.setItem("authStatus", false);
          console.log('We are going to Login')
          // navigate("/login")
        }
      })
     .catch(e => {navigate("/login")})
      
    

    if (authStatus && !socket.connected) {
      socket.connect();
      socket.on("connect", () => {
        console.log("Connected to server:", socket.connected);
      });
      socket.on("disconnect", () => {
        console.log("Connected to server:", socket.connected);
      });
    }
    return () => {
      console.log('running cleanup')
      socket.disconnect();
      socket.off("connect", () => {
        console.log("Connected to server:", socket.connected);
      });
      socket.off("disconnect", () => {
        console.log("Connected to server:", socket.connected);
      });
    }
  }, []);
  
  const logout = async () => {
    await fetch('http://localhost:3001/api/userlogout', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      mode: "cors",
    });
    socket.disconnect();
    dangerouslySetAuthStatus(false);
    localStorage.removeItem("authStatus");
    socket.off("connect", () => {
      console.log("Connected to server");
    });
    socket.off("disconnect", () => {
      console.log("Disconnected from server");
    });
    navigate("/login")
  }

  const login = () => {
    socket.connect();
    dangerouslySetAuthStatus(true);
    localStorage.setItem("authStatus", true);
    navigate("/")
  }

  return (
    <AuthContext.Provider value={{ authStatus, logout, login, dangerouslySetAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);