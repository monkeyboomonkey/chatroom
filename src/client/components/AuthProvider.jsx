import React, { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../Context";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [authStatus, dangerouslySetAuthStatus] = useState(localStorage.getItem("authStatus") || false);
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();
  console.log(localStorage.getItem("authStatus"));
  useEffect(() => {
    if (authStatus && !socket.connected) {
      socket.connect();
      socket.on("connect", () => {
        console.log("Connected to server:", socket.connected);
      });
      socket.on("disconnect", () => {
        console.log("Connected to server:", socket.connected);
        socket.off("connect", () => {
          console.log("Connected to server:", socket.connected);
        });
        socket.off("disconnect", () => {
          console.log("Connected to server:", socket.connected);
        });
      });
    }

    return () => {
      socket.disconnect();
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