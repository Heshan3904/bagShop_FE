import { createContext, useContext, useEffect, useState } from "react";
import {
    loginUser,
    logoutUser,
    getCurrentUser,
    isAuthenticated,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getCurrentUser());
    const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = getCurrentUser();

        if (currentUser) {
            setUser(currentUser);
            setIsLoggedIn(true);
        }
        setLoading(false);
    }, []);

    const login = async (userData) => {
        
            const response = await loginUser(userData);
            setUser(response.user);
            setIsLoggedIn(true);
            return data;
        };


    const logout = async () => {
        logoutUser();
        setUser(null);
        setIsLoggedIn(false);
    };


    return (
        <AuthContext.Provider
        value={{ user, isLoggedIn, login, logout, }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
