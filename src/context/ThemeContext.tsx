// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/localStorage';

// Theme type
export type Theme = 'dark' | 'light';

// Theme context type
interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark',
    toggleTheme: () => {},
    setTheme: () => {},
});

// Provider component
export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    // Initialize theme from local storage or default to 'dark'
    const [theme, setTheme] = useState<Theme>(() => {
        const savedPreferences = storageService.getPreferences();
        return savedPreferences.theme || 'dark';
    });

    // Apply theme class to document element
    useEffect(() => {
        const root = document.documentElement;

        if (theme === 'dark') {
            root.classList.add('dark-theme');
            root.classList.remove('light-theme');
        } else {
            root.classList.add('light-theme');
            root.classList.remove('dark-theme');
        }

        // Save to local storage
        storageService.savePreferences({ theme });
    }, [theme]);

    // Toggle between light and dark
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme,
                setTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook for using the theme context
export const useTheme = () => useContext(ThemeContext);