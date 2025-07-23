// components/ThemeWrapper.tsx
"use client";

import { useSettings } from '../contexts/SettingsContext';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const { theme, fontSize } = useSettings();

    return (
        <div 
            className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} min-h-screen`} 
            style={{ fontSize: `${fontSize}px` }} 
        >
            {children}
        </div>
    );
}
