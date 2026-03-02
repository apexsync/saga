import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, onAuthChange, logoutCustomer } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Firebase Auth state observer — automatically handles session persistence
        const unsubscribe = onAuthChange((firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    id: firebaseUser.id,
                    name: firebaseUser.name,
                    email: firebaseUser.email,
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const login = (userData) => {
        // Firebase Auth handles persistence automatically via onAuthChange
        // This is called after successful loginCustomer() to immediately update state
        setUser(userData);
    };

    const logout = async () => {
        await logoutCustomer();
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
