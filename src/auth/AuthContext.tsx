import React, { createContext, useContext, useState } from 'react';

// Define the shape of the context
interface AuthContextData {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextData | undefined>(undefined);

// Export a custom hook to access the context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// AuthProvider component to wrap the entire application
const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = () => {
        // Implement your login logic here, e.g., check credentials, set isAuthenticated to true, etc.
        setIsAuthenticated(true);
    };

    const logout = () => {
        // Implement your logout logic here, e.g., clear credentials, set isAuthenticated to false, etc.
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
