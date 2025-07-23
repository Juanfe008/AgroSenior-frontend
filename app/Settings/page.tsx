"use client";

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useSettings } from '../contexts/SettingsContext';

export default function Settings() {
    const {
        theme, setTheme,
        fontSize, setFontSize
    } = useSettings();

    const [tempTheme, setTempTheme] = useState(theme);
    const [tempFontSize, setTempFontSize] = useState(fontSize);
    const [changesSaved, setChangesSaved] = useState(false); // Indicador de cambios guardados

    useEffect(() => {
        setTempTheme(theme);
        setTempFontSize(fontSize);
    }, [theme, fontSize]);

    const isDark = tempTheme === 'dark';

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTempTheme(event.target.value);
    };

    const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTempFontSize(Number(event.target.value));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setTheme(tempTheme);
        setFontSize(tempFontSize);
        localStorage.setItem('theme', tempTheme);
        localStorage.setItem('fontSize', tempFontSize.toString());
        console.log('Settings saved:', { theme: tempTheme, fontSize: tempFontSize });
        setChangesSaved(true); // Indicar que los cambios se han guardado
        setTimeout(() => setChangesSaved(false), 3000); // Resetear el indicador después de 3 segundos
    };

    return (
        <div className={isDark ? 'bg-gray-900 min-h-screen' : 'bg-gray-100 min-h-screen'}>
            <Navbar title='Configuración' backRoute='ActionPanel' />
            <div className={`p-4 ${isDark ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-900'}`} style={{ fontSize: `${tempFontSize}px` }}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Tema */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Tema</label>
                        <select
                            value={tempTheme}
                            onChange={handleThemeChange}
                            className={`p-2 border rounded w-full ${
                                isDark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'
                            }`}
                        >
                            <option value="light">Claro</option>
                            <option value="dark">Oscuro</option>
                        </select>
                    </div>

                    {/* Tamaño de la fuente */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Tamaño de la fuente</label>
                        <input
                            type="range"
                            min="12"
                            max="24"
                            value={tempFontSize}
                            onChange={handleFontSizeChange}
                            className={`w-full ${isDark ? 'accent-blue-500' : 'accent-blue-600'}`}
                        />
                        <span className="text-sm">{tempFontSize}px</span>
                    </div>

                    {/* Botón de guardar */}
                    <button
                        type="submit"
                        className={`w-full p-2 rounded transition-colors ${
                            isDark 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                    >
                        Guardar cambios
                    </button>
                    {/* Indicador de cambios guardados */}
                    {changesSaved && <div className="text-sm text-green-500 mt-2">Cambios guardados con éxito.</div>}
                </form>
            </div>
        </div>
    );
}