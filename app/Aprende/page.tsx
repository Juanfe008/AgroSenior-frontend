'use client'

import Link from 'next/link';
import { useState } from 'react';

export default function Aprende() {
    const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

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
                    <div className="text-4xl font-bold">Selecciona tu Nivel de Aprendizaje</div>
                    <button className="bg-red-500 rounded p-2">
                        SALIR
                    </button>
                </div>
            </nav>
            <div className="container mx-auto mt-8 bg-green-900 p-4 rounded-lg">
                <div className="flex flex-col items-center gap-4">
                    {['Introducción', 'Componentes y Diseño', 'Técnicas de Cultivo', 'Avanzado', 'Experto'].map((level, index) => (
                        <div key={index} className={`w-full flex flex-col items-center justify-center p-4 border-2 border-white rounded-lg ${selectedLevel !== null ? 'hidden' : ''}`}>
                            <div className="flex items-center gap-4">
                                <img src={`icon-${index + 1}.png`} alt={`Icono Nivel ${index + 1}`} className="w-10 h-10" />
                                <div className="text-xl font-bold">Nivel {index + 1}: {level}</div>
                            </div>
                            <p className="mt-2">Descripción breve del Nivel {index + 1}</p>
                            <button className="mt-4 bg-green-500 text-white py-2 px-4 rounded" onClick={() => setSelectedLevel(index)}>Seleccionar</button>
                        </div>
                    ))}
                    {selectedLevel !== null && (
                        <div className="w-full mt-8">
                            <div className="w-1/2 mx-auto bg-blue-500 p-2 rounded-full">
                                <div className="bg-white h-2 rounded-full">
                                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '50%' }}></div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <h2 className="text-2xl font-bold">Contenido del Nivel {selectedLevel + 1}</h2>
                                <div className="flex flex-col gap-4 mt-4">
                                    {[1, 2, 3, 4, 5].map((content, index) => (
                                        <div key={index} className="p-4 border-2 border-white rounded-lg">
                                            <h3 className="text-xl font-bold">Contenido {content}</h3>
                                            <p>Descripción del contenido {content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded" onClick={() => setSelectedLevel(null)}>Regresar a los Niveles</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}