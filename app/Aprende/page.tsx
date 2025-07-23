"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchLeccionesByNivel } from './leccion/services/leccion.service';
import Navbar from '../components/Navbar';
import { Sprout, Leaf, Flower, Flower2, Clover } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export default function Aprende() {
    const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
    const [lecciones, setLecciones] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { theme } = useSettings();
    const isDark = theme === 'dark';

    useEffect(() => {
        if (selectedLevel !== null) {
            const nivelId = selectedLevel + 1;
            setLoading(true);
            setError(null);

            fetchLeccionesByNivel(nivelId.toString(), localStorage.getItem('userId') || '')
                .then((data) => {
                    setLecciones(data);
                })
                .catch((err) => {
                    setError("Error al cargar las lecciones");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [selectedLevel]);

    const totalLecciones = lecciones.length;
    const leccionesCompletadas = lecciones.filter(leccion => leccion.completed).length;
    const progreso = totalLecciones > 0 ? (leccionesCompletadas / totalLecciones) * 100 : 0;

    return (
        <div className={isDark ? 'bg-gray-900 min-h-screen' : 'bg-white min-h-screen'}>
            <Navbar backRoute='/ActionPanel' title={`${selectedLevel !== null ? 'Escoge una lección' : 'Escoge un nivel'}`} />
            <div className={`container mx-auto mt-8 ${isDark ? 'bg-gray-800' : 'bg-green-900'} p-4 rounded-lg`}>
                <div className="flex flex-col items-center gap-4">
                    {['Introducción', 'Componentes y Diseño', 'Técnicas de Cultivo', 'Avanzado', 'Experto'].map((level, index) => (
                        <div key={index} className={`w-full flex flex-col items-center justify-center p-4 ${isDark ? 'border-gray-600' : 'border-white'} border-2 rounded-lg ${selectedLevel !== null ? 'hidden' : ''} ${isDark ? 'text-gray-200' : 'text-white'}`} onClick={() => setSelectedLevel(index)} style={{ cursor: 'pointer' }}>
                            <div className="flex items-center gap-4">
                                {index === 0 && <Sprout className="w-10 h-10" />}
                                {index === 1 && <Leaf className="w-10 h-10" />}
                                {index === 2 && <Flower className="w-10 h-10" />}
                                {index === 3 && <Flower2 className="w-10 h-10" />}
                                {index === 4 && <Clover className="w-10 h-10" />}
                                <div className="text-xl font-bold">Nivel {index + 1}: {level}</div>
                            </div>
                            <p className="mt-2">Descripción breve del Nivel {index + 1}</p>
                        </div>
                    ))}
                    {selectedLevel !== null && (
                        <div className={`w-full mt-8 ${isDark ? 'text-gray-200' : 'text-white'}`}>
                            <button className={`${isDark ? 'bg-blue-600' : 'bg-blue-500'} text-white py-2 px-4 rounded hover:opacity-90`} onClick={() => setSelectedLevel(null)}>Regresar a los Niveles</button>
                            <div className="mt-4">
                                <h2 className="text-2xl font-bold">Contenido del Nivel {selectedLevel + 1}</h2>

                                {loading ? (
                                    <p>Cargando lecciones...</p>
                                ) : error ? (
                                    <p className="text-red-500">{error}</p>
                                ) : (
                                    <div className="flex flex-col gap-4 mt-4">
                                        {lecciones.length > 0 ? (
                                            lecciones.map((leccion, index) => {
                                                const isCompleted = leccion.completed;

                                                return (
                                                    <div
                                                        key={index}
                                                        className={`p-4 border-2 rounded-lg hover:opacity-90 transition-all duration-300 cursor-pointer
                    ${isDark ? 'border-gray-600' : 'border-white'}
                    ${isCompleted ? (isDark ? 'bg-green-800 border-green-400' : 'bg-blue-500 border-blue-600') : ''}
                `}
                                                    >
                                                        <Link href={`/Aprende/leccion/${leccion.id}`}>
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <h3 className="text-xl font-bold">{leccion.title}</h3>
                                                                    <p>{leccion.desc}</p>
                                                                </div>
                                                                {isCompleted && (
                                                                    <span className="text-green-500 text-2xl">✓</span>
                                                                )}
                                                            </div>
                                                        </Link>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p>No hay lecciones disponibles para este nivel</p>
                                        )}
                                    </div>
                                )}

                            </div>
                            <div className="w-1/2 mx-auto mt-4 bg-blue-500 p-2 rounded-full">
                                <div className={`${isDark ? 'bg-gray-700' : 'bg-white'} h-2 rounded-full`}>
                                    <div
                                        className="h-2 bg-green-500 rounded-full transition-all duration-500"
                                        style={{ width: `${progreso}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
