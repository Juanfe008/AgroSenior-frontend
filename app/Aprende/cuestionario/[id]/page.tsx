'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { fetchCuestionario, registrarCuestionarioCompletado } from '../services/cuestionario.service';
import Navbar from '@/app/components/Navbar';
import ResultadoFinal from '../components/ResultadoFinal';
import Pregunta from '../components/Pregunta';
import { useSettings } from '@/app/contexts/SettingsContext';

const Cuestionario: React.FC = () => {
    const { id } = useParams();
    const [preguntaActiva, setPreguntaActiva] = useState(0);
    const [cuestionario, setCuestionario] = useState<CuestionarioData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [preguntasContestadas, setPreguntasContestadas] = useState<boolean[]>([]);
    const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<{ opcionSeleccionada: number | null; respuestaCorrecta: number | null }[]>([]);
    const [puntaje, setPuntaje] = useState<number>(0);
    const [finalizado, setFinalizado] = useState<boolean>(false);
    const [mensajeFinalizacion, setMensajeFinalizacion] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const { theme } = useSettings();
    const isDark = theme === 'dark';

    const cuestionarioId = typeof id === 'string' ? parseInt(id) : 1;

    useEffect(() => {
        const cargarCuestionario = async () => {
            setLoading(true);
            try {
                const data = await fetchCuestionario(cuestionarioId);
                setCuestionario(data);
                setPreguntasContestadas(Array(data.preguntas.length).fill(false));
                setRespuestaSeleccionada(Array(data.preguntas.length).fill({ opcionSeleccionada: null, respuestaCorrecta: null }));
            } catch (error) {
                setError('No se pudo cargar el cuestionario');
            } finally {
                setLoading(false);
            }
        };

        cargarCuestionario();

        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(parseInt(storedUserId));
        }
    }, [cuestionarioId]);

    const siguientePregunta = () => {
        if (cuestionario && preguntaActiva < (cuestionario.preguntas?.length || 0) - 1) {
            setPreguntaActiva((prev) => prev + 1);
        }
    };

    const anteriorPregunta = () => {
        if (preguntaActiva > 0) {
            setPreguntaActiva((prev) => prev - 1);
        }
    };

    const handleOpcionClick = (id: number, esCorrecta: boolean) => {
        const correcta = cuestionario?.preguntas[preguntaActiva].opciones.find(opcion => opcion.esCorrecta)?.id || null;

        setRespuestaSeleccionada((prev) => {
            const nuevasRespuestas = [...prev];
            nuevasRespuestas[preguntaActiva] = { opcionSeleccionada: id, respuestaCorrecta: correcta };
            return nuevasRespuestas;
        });

        setPreguntasContestadas((prev) => {
            const nuevasContestadas = [...prev];
            nuevasContestadas[preguntaActiva] = true;
            return nuevasContestadas;
        });

        if (esCorrecta) {
            setPuntaje((prev) => prev + 1);
        }
    };

    const finalizarCuestionario = async () => {
        const totalPreguntas = cuestionario?.preguntas.length || 1;
        const calificacion = (puntaje / totalPreguntas) * 100;
        setFinalizado(true);

        const expGanada = puntaje * 10;

        if (calificacion >= 60 && userId !== null) {
            try {
                const response = await registrarCuestionarioCompletado(userId, cuestionarioId, expGanada);
                setMensajeFinalizacion(response.message);
            } catch (error) {
                setMensajeFinalizacion('Este cuestionario ya fue aprobado.');
            }
        }
        else {
            setMensajeFinalizacion('La calificación fue menor al 60%, no se registrará el cuestionario como completado')
        }
    };

    const todasPreguntasContestadas = preguntasContestadas.every(contestada => contestada);
    const esUltimaPregunta = cuestionario?.preguntas && preguntaActiva === cuestionario.preguntas.length - 1;

    if (loading) {
        return <div className={isDark ? 'text-gray-200' : ''}>Cargando cuestionario...</div>;
    }

    if (error) {
        return <div className={isDark ? 'text-gray-200' : ''}>{error}</div>;
    }

    if (finalizado) {
        const totalPreguntas = cuestionario?.preguntas.length || 1;
        const calificacion = ((puntaje / totalPreguntas) * 100).toFixed(2);

        return (
            <ResultadoFinal
                puntaje={puntaje}
                totalPreguntas={totalPreguntas}
                calificacion={calificacion}
                mensajeFinalizacion={mensajeFinalizacion}
            />
        );
    }

    return (
        <div className={isDark ? 'bg-gray-900' : ''}>
            <Navbar backRoute='/Aprende' title={`Cuestionario`} />
            <div className={`min-h-screen flex items-start justify-center p-6 ${
                isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-purple-50'
            }`}>
                <div className={`max-w-3xl w-full shadow-2xl rounded-xl overflow-hidden ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                }`}>
                    {/* Contenedor de la pregunta */}
                    <div className="relative min-h-[24rem] max-h-[80vh] overflow-auto">
                        <AnimatePresence custom={preguntaActiva}>
                            {cuestionario && (
                                <Pregunta
                                    key={cuestionario.preguntas[preguntaActiva].id}
                                    pregunta={cuestionario.preguntas[preguntaActiva]}
                                    respuestaSeleccionada={respuestaSeleccionada[preguntaActiva]}
                                    preguntaContestada={preguntasContestadas[preguntaActiva]}
                                    handleOpcionClick={handleOpcionClick}
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Botones de navegación */}
                    <div className={`p-6 border-t ${
                        isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}>
                        <div className="flex justify-between">
                            <button
                                onClick={anteriorPregunta}
                                disabled={preguntaActiva === 0}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                    preguntaActiva === 0
                                        ? isDark ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }`}
                            >
                                Anterior
                            </button>
                            <button
                                onClick={esUltimaPregunta ? finalizarCuestionario : siguientePregunta}
                                disabled={
                                    (esUltimaPregunta && !todasPreguntasContestadas) ||
                                    !cuestionario?.preguntas?.length
                                }
                                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                    (esUltimaPregunta && !todasPreguntasContestadas) || !cuestionario?.preguntas?.length
                                        ? isDark ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }`}
                            >
                                {esUltimaPregunta ? 'Finalizar cuestionario' : 'Siguiente'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cuestionario;