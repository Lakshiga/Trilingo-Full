import React, { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    accent: string;
  };
}

const lightColors = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#2C3E50',
  accent: '#45B7D1'
};

const darkColors = {
  primary: '#FF8E8E',
  secondary: '#6EDDD6',
  background: '#1A1A1A',
  surface: '#2D2D2D',
  text: '#FFFFFF',
  accent: '#5BC0DE'
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    colors
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};