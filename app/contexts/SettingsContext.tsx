"use client";

import React, { createContext, useContext, useState } from 'react';

interface SettingsContextType {
    theme: string;
    setTheme: (theme: string) => void;
    fontSize: number;
    setFontSize: (fontSize: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState('light');
    const [fontSize, setFontSize] = useState(16); 

    return (
        <SettingsContext.Provider value={{ 
            theme, setTheme, 
            fontSize, setFontSize 
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};