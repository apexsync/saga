import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session on mount
        const token = localStorage.getItem('customerAccessToken');
        if (token) {
            // In a real app, you'd validate the token with an API call here.
            // For now, we'll assume if the token exists, the user is logged in.
            // We can try to fetch the customer profile if needed, but for the navbar toggle, existence is enough.
            setUser({ email: "customer@example.com", name: "Valued Customer" }); 
        }
        setLoading(false);
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('customerAccessToken', token);
        setUser(userData || { email: "customer@example.com", name: "Valued Customer" });
    };

    const logout = () => {
        localStorage.removeItem('customerAccessToken');
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
