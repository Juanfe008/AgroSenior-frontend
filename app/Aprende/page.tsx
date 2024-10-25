"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchLeccionesByNivel } from './leccion/services/leccion.service';

export default function Aprende() {
    const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
    const [lecciones, setLecciones] = useState<any[]>([]); 
    const [loading, setLoading] = useState<boolean>(false); 
    const [error, setError] = useState<string | null>(null); 

    useEffect(() => {
        if (selectedLevel !== null) {
            const nivelId = selectedLevel + 1; 
            setLoading(true);
            setError(null);

            fetchLeccionesByNivel(nivelId.toString())
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

    return (
        <div>
            {/* Navbar */}
            <nav className="bg-green-900 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/ActionPanel">
                        <button className="bg-blue-500 rounded p-2">
                            REGRESAR
                        </button>
                    </Link>
                    <div className="text-4xl font-bold">{selectedLevel !== null ? 'Escoge una lección' : 'Escoge un nivel'}</div>
                    <button className="bg-red-500 rounded p-2">
                        SALIR
                    </button>
                </div>
            </nav>
            <div className="container mx-auto mt-8 bg-green-900 p-4 rounded-lg">
                <div className="flex flex-col items-center gap-4">
                    {['Introducción', 'Componentes y Diseño', 'Técnicas de Cultivo', 'Avanzado', 'Experto'].map((level, index) => (
                        <div key={index} className={`w-full flex flex-col items-center justify-center p-4 border-2 border-white rounded-lg ${selectedLevel !== null ? 'hidden' : ''}`} onClick={() => setSelectedLevel(index)} style={{ cursor: 'pointer' }}>
                            <div className="flex items-center gap-4">
                                <img src={`icon-${index + 1}.png`} alt={`Icono Nivel ${index + 1}`} className="w-10 h-10" />
                                <div className="text-xl font-bold">Nivel {index + 1}: {level}</div>
                            </div>
                            <p className="mt-2">Descripción breve del Nivel {index + 1}</p>
                        </div>
                    ))}
                    {selectedLevel !== null && (
                        <div className="w-full mt-8">
                            <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={() => setSelectedLevel(null)}>Regresar a los Niveles</button>
                            <div className="mt-4">
                                <h2 className="text-2xl font-bold">Contenido del Nivel {selectedLevel + 1}</h2>

                                {loading ? (
                                    <p>Cargando lecciones...</p>
                                ) : error ? (
                                    <p className="text-red-500">{error}</p>
                                ) : (
                                    <div className="flex flex-col gap-4 mt-4">
                                        {lecciones.length > 0 ? (
                                            lecciones.map((leccion, index) => (
                                                <div key={index} className="p-4 border-2 border-white rounded-lg">
                                                    <Link href={`/Aprende/leccion/${leccion.id}`}>
                                                        <h3 className="text-xl font-bold">{leccion.title}</h3>
                                                        <p>{leccion.desc}</p>
                                                    </Link>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No hay lecciones disponibles para este nivel</p>
                                        )}
                                    </div>
                                )}

                            </div>
                            <div className="w-1/2 mx-auto mt-4 bg-blue-500 p-2 rounded-full">
                                <div className="bg-white h-2 rounded-full">
                                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '50%' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
}
