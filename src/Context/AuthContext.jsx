import { createContext, useContext, useState, useEffect } from 'react';
import { fetchCustomerProfile } from '../services/shopify';
import { setCookie, getCookie, eraseCookie } from '../utils/cookies';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
             // Cookie is a safer place for Auth Tokens (in real apps, use HttpOnly)
             const token = getCookie('customerAccessToken');
             if (token) {
                 try {
                     const profile = await fetchCustomerProfile();
                     setUser({
                         name: profile.firstName + (profile.lastName ? ' ' + profile.lastName : ''),
                         email: profile.email,
                         ...profile
                     });
                 } catch (error) {
                     console.error("Failed to restore session", error);
                     eraseCookie('customerAccessToken');
                 }
             }
             setLoading(false);
        };
        initAuth();
    }, []);

    const login = (token, userData) => {
        // Store token in cookie for 1 day
        setCookie('customerAccessToken', token, 1);
        setUser(userData || { email: "customer@example.com", name: "Valued Customer" });
    };

    const logout = () => {
        eraseCookie('customerAccessToken');
        setUser(null);
    };

    const updateUser = (userData) => {
        setUser(prev => ({ ...prev, ...userData }));
    };

    const value = {
        user,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
