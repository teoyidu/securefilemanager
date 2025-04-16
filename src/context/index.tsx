// src/context/index.tsx
import React from 'react';
import { FileProvider } from './FileContext';
import { ActionProvider } from './ActionContext';
import { AppProvider } from './AppContext';
import { ThemeProvider } from './ThemeContext';

// Root provider that combines all contexts
export const AppContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    return (
        <ThemeProvider>
            <AppProvider>
                <FileProvider>
                    <ActionProvider>
                        {children}
                    </ActionProvider>
                </FileProvider>
            </AppProvider>
        </ThemeProvider>
    );
};

// Re-export all hooks for easy access
export { useApp } from './AppContext';
export { useFiles } from './FileContext';
export { useActions } from './ActionContext';
export { useTheme } from './ThemeContext';