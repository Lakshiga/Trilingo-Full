import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  userId: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: { username: string; email: string; password: string; nativeLanguage?: string; targetLanguage?: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate auto-login for demo purposes
    setUser({
      userId: 1,
      username: 'Tamil Learner',
      email: 'learner@trillingo.com'
    });
    setIsAuthenticated(true);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate login
      setUser({
        userId: 1,
        username: username,
        email: `${username}@trillingo.com`
      });
      setIsAuthenticated(true);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (userData: { username: string; email: string; password: string; nativeLanguage?: string; targetLanguage?: string }): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate registration
      setUser({
        userId: 1,
        username: userData.username,
        email: userData.email
      });
      setIsAuthenticated(true);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};