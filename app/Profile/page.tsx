'use client';

import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import { fetchUserProfile, updateUsername } from "./services/profile.service";
import { useSettings } from '../contexts/SettingsContext';

interface User {
    id: number;
    exp: number;
    email: string;
    xpToNextLevel: number;
    username: string;
    nivel: number;
    foto: string;
    insignias: {
        badge: {
            id: number;
            nombre: string;
            imagen: string;
            descripcion: string;
        };
        obtenidoEn: string;
    }[];
}

export default function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const { theme } = useSettings();
    const isDark = theme === 'dark';

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData = await fetchUserProfile();
                const defaultUserData = {
                    ...userData,
                    xpToNextLevel: userData.xpToNextLevel || 100,
                    nivel: userData.nivel || 1,
                    foto: userData.foto || "/images/pp.png", // Imagen por defecto
                };
                setUser(defaultUserData);
                setNewUsername(defaultUserData.username);
            } catch (error) {
                setError('Error al cargar el perfil del usuario.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        if (user) {
            try {
                // Llama a la función updateUsername para actualizar el nombre de usuario en el backend
                await updateUsername(user.id, newUsername);
                // Actualiza el estado local del usuario con el nuevo nombre de usuario
                setUser({ ...user, username: newUsername });
                setIsEditing(false);
            } catch (error) {
                setError('Error al actualizar el nombre de usuario.');
            }
        }
    };

    if (loading) return <div className={`text-center py-8 ${isDark ? 'text-gray-200' : ''}`}>Cargando perfil...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
    if (!user) return null;

    const progressPercentage = (user.exp / user.xpToNextLevel) * 100;

    return (
        <div className={isDark ? 'bg-gray-900' : ''}>
            <Navbar backRoute="/ActionPanel" title="Perfil" />
            <div className={`flex flex-col items-center justify-center p-8 min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br'}`}>
                <div className={`shadow-lg rounded-lg p-6 w-full max-w-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                    <img
                        src={user.foto}
                        alt={`${user.username} foto de perfil`}
                        className="rounded-full w-32 h-32 mb-4 mx-auto border-4 border-blue-500"
                    />
                    <div className="flex items-center justify-center mb-2">
                        {isEditing ? (
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    className={`border rounded px-2 py-1 mr-2 ${
                                        isDark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'border-gray-300'
                                    }`}
                                />
                                <button
                                    onClick={handleSaveClick}
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                >
                                    Guardar
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 className={`text-2xl font-semibold text-center ${isDark ? 'text-gray-200' : 'text-black'}`}>
                                    {user.username}
                                </h2>
                                <button
                                    onClick={handleEditClick}
                                    className="ml-2 text-blue-500 hover:text-blue-700"
                                >
                                    ✏️
                                </button>
                            </>
                        )}
                    </div>
                    <h2 className={`text-2xl font-semibold text-center mb-2 ${isDark ? 'text-gray-200' : 'text-black'}`}>
                        {user.email}
                    </h2>
                    <p className={`text-center mb-1 ${isDark ? 'text-gray-200' : 'text-black'}`}>
                        Nivel: {user.nivel}
                    </p>

                    {/* Barra de progreso */}
                    <div className={`w-full rounded-full h-4 mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div
                            className="bg-blue-500 h-full rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <p className={`text-center text-sm ${isDark ? 'text-gray-200' : 'text-black'}`}>
                        {user.exp}/{user.xpToNextLevel} XP
                    </p>

                    {/* Sección de insignias */}
                    <div className="mt-6">
                        <h3 className={`text-lg font-semibold text-center mb-2 ${isDark ? 'text-gray-200' : 'text-black'}`}>
                            Insignias Obtenidas
                        </h3>
                        {user.insignias?.length > 0 ? (
                            <div className="flex flex-wrap justify-center">
                                {user.insignias.map((insignia) => (
                                    <div key={insignia.badge.id} className="flex flex-col items-center m-2">
                                        <img
                                            src={insignia.badge.imagen}
                                            alt={insignia.badge.nombre}
                                            className="w-12 h-12 mb-1"
                                        />
                                        <span className={`text-sm text-center ${isDark ? 'text-gray-200' : 'text-black'}`}>
                                            {insignia.badge.nombre}
                                        </span>
                                        {/* Información de la insignia */}
                                        <div className={`text-center text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            <p><strong>Descripción:</strong> {insignia.badge.descripcion}</p>
                                            <p><strong>Obtenida el:</strong> {new Date(insignia.obtenidoEn).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                No has obtenido ninguna insignia aún.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}