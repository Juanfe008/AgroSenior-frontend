'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '@/app/contexts/SettingsContext';

interface Opcion {
    id: number;
    texto: string;
    esCorrecta: boolean;
}

interface PreguntaProps {
    pregunta: {
        id: number;
        texto: string;
        opciones: Opcion[];
    };
    respuestaSeleccionada: {
        opcionSeleccionada: number | null;
        respuestaCorrecta: number | null;
    };
    preguntaContestada: boolean;
    handleOpcionClick: (id: number, esCorrecta: boolean) => void;
}

const Pregunta: React.FC<PreguntaProps> = ({
    pregunta,
    respuestaSeleccionada,
    preguntaContestada,
    handleOpcionClick,
}) => {
    const { theme } = useSettings();
    const isDark = theme === 'dark';

    return (
        <motion.div
            className="absolute w-full min-h-full flex flex-col items-center justify-center p-6"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5 }}
        >
            <div
                className={`p-8 rounded-xl shadow-lg w-full max-w-2xl ${isDark
                        ? 'bg-gray-800 border border-gray-700'
                        : 'bg-white border border-gray-100'
                    }`}
            >
                <h2
                    className={`text-2xl font-bold text-center mb-6 ${isDark ? 'text-gray-200' : 'text-gray-800'
                        } whitespace-normal break-words`}
                >
                    {pregunta.texto}
                </h2>
                <div className="space-y-4">
                    {pregunta.opciones.map((opcion) => {
                        const esCorrecta =
                            opcion.id === respuestaSeleccionada.respuestaCorrecta;
                        const esSeleccionada =
                            opcion.id === respuestaSeleccionada.opcionSeleccionada;
                        const colorClase = esSeleccionada
                            ? esCorrecta
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-red-600 hover:bg-red-700'
                            : esCorrecta
                                ? 'bg-green-600 hover:bg-green-700'
                                : isDark
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-blue-500 hover:bg-blue-600';

                        return (
                            <button
                                key={opcion.id}
                                onClick={() =>
                                    handleOpcionClick(opcion.id, opcion.esCorrecta)
                                }
                                disabled={preguntaContestada}
                                className={`w-full px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 ${colorClase} whitespace-normal break-words`}
                            >
                                {opcion.texto}
                            </button>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};

export default Pregunta;
