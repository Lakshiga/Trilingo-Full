import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { AuthResponse, LoginRequest } from '../types/auth';
import * as authApi from '../api/authApi';
import * as authService from '../services/authService';

interface AuthContextType {
    isAuthenticated: boolean;
    accessToken: string | null;
    isLoading: boolean;
    login: (credentials: LoginRequest) => Promise<AuthResponse>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(authService.getAccessToken());
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await authApi.login(credentials);
        if (response.isSuccess && response.token) {
            authService.saveTokens(response);
            setAccessToken(response.token);
        }
        return response;
    };

    const logout = () => {
        authService.clearTokens();
        setAccessToken(null);
    };

    const value = {
        isAuthenticated: !!accessToken,
        accessToken,
        isLoading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};