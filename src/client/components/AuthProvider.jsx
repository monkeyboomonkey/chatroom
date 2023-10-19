import React, { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../Context";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const { socket } = useContext(SocketContext);
  const [authStatus, dangerouslySetAuthStatus] = useState(null);
  const navigate = useNavigate();
  if (authStatus === null) {
    dangerouslySetAuthStatus(localStorage.getItem("authStatus") || false);
  }
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
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
    dangerouslySetAuthStatus(false);
    localStorage.removeItem("authStatus");
    navigate("/login")
  }
  const login = () => {
    socket.connect();
    socket.on("connect", () => {
      console.log("Connected to server");
    });
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