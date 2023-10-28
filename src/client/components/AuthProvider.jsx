import React, { useContext, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setIsAuth,setUserIdentity } from "../util/chatroomReducer.ts";

/*
* Auth Provider wraps the entire app, except for the login and signup pages (not protected routes)
* Auth Provider checks if user is authenticated on page load
* If user is authenticated, set user in redux store and set auth status to true
* If user is not authenticated, set auth status to false and redirect to login page
*/

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const authStatus = useSelector((state) => state.chatroomReducer.isAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /*
  * Verify user on page load, done by useEffect below
  */
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await fetch('api/verify', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          mode: "cors",
        });
        
        if (!response.ok) throw new Error('Failed to verify user');
        const data = await response.json();
        
        dispatch(setUserIdentity(data));
        if (!authStatus || authStatus === null) dispatch(setIsAuth(true)); //! setIsAuth HAS to call before setUser
      } catch (err) {
        console.log(err);
        dispatch(setIsAuth(false));
        navigate('/login');
      }
    }
    verifyUser();
  }, [])

  return (
    <AuthContext.Provider value={{ authStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);