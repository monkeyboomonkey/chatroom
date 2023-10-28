import React, { useContext, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setIsAuth, setUserIdentity } from "../util/chatroomReducer";
const AuthContext = createContext({});
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
                if (!response.ok)
                    throw new Error('Failed to verify user');
                const data = await response.json();
                dispatch(setUserIdentity(data));
                if (!authStatus || authStatus === null)
                    dispatch(setIsAuth(true)); //! setIsAuth HAS to call before setUser
            }
            catch (err) {
                console.log(err);
                dispatch(setIsAuth(false));
                navigate('/login');
            }
        };
        verifyUser();
    }, []);
    return (React.createElement(AuthContext.Provider, { value: { authStatus } }, children));
};
export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
//# sourceMappingURL=AuthProvider.js.map