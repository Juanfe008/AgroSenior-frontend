'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from "../../components/Navbar";
import { fetchUserProfile } from "../services/profile.service";

interface User {
    exp: number;
    email: string;
    xpToNextLevel: number;
    username: string;
    nivel: number;
    foto: string;
    insignias: { id: string; imagen: string; nombre: string }[];
}

export default function Profile() {
    const { id } = useParams(); 
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData = await fetchUserProfile();
                const defaultUserData = {
                    ...userData,
                    xpToNextLevel: userData.xpToNextLevel || 100, 
                    nivel: userData.nivel || 1, 
                };
                setUser(defaultUserData);
            } catch (error) {
                setError('Error al cargar el perfil del usuario.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    if (loading) return <div>Cargando perfil...</div>;
    if (error) return <div>{error}</div>;

    if (!user) return null; 

    const progressPercentage = (user.exp / user.xpToNextLevel) * 100;

    return (
        <div>
            <Navbar backRoute="/ActionPanel" title="Perfil"/>
            <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br min-h-screen">
                <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                    <img
                        src={user.foto}
                        alt={`${user.username} foto de perfil`}
                        className="rounded-full w-32 h-32 mb-4 mx-auto border-4 border-blue-500"
                    />
                    <h2 className="text-2xl font-semibold text-center mb-2 text-black">{user.username}</h2>
                    <h2 className="text-2xl font-semibold text-center mb-2 text-black">{user.email}</h2>
                    <p className="text-center mb-1 text-black">Nivel: {user.nivel}</p>

                    {/* Barra de progreso */}
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                        <div
                            className="bg-blue-500 h-full rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <p className="text-center text-sm text-black">{user.exp}/{user.xpToNextLevel} XP</p>

                    {/* Sección de insignias */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-center mb-2 text-black">Insignias Obtenidas</h3>
                        <div className="flex flex-wrap justify-center">
                            {user.insignias?.map((insignia) => (
                                <div key={insignia.id} className="flex flex-col items-center m-2">
                                    <img
                                        src={insignia.imagen}
                                        alt={insignia.nombre}
                                        className="w-12 h-12 mb-1"
                                    />
                                    <span className="text-sm text-center text-black">{insignia.nombre}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
