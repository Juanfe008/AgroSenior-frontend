'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCuestionario } from '../services/cuestionario.service';

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

    const finalizarCuestionario = () => {
        setFinalizado(true);
    };

    const todasPreguntasContestadas = preguntasContestadas.every(contestada => contestada);
    const esUltimaPregunta = cuestionario?.preguntas && preguntaActiva === cuestionario.preguntas.length - 1;

    const slideVariants = {
        hidden: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
        }),
        visible: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -300 : 300,
            opacity: 0,
        }),
    };

    if (loading) {
        return <div>Cargando cuestionario...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (finalizado) {
        const totalPreguntas = cuestionario?.preguntas.length || 1;
        const calificacion = ((puntaje / totalPreguntas) * 100).toFixed(2);
        return (
            <div className="flex flex-col items-center text-black">
                <h2 className="text-3xl font-bold mb-4">¡Cuestionario Finalizado!</h2>
                <p className="text-2xl">Puntaje: {puntaje} / {totalPreguntas}</p>
                <p className="text-2xl">Calificación: {calificacion}%</p>
                <Link href="/Aprende">
                    <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Volver al Inicio</button>
                </Link>
            </div>
        );
    }

    return (
        <div>
            <nav className="bg-green-900 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/Aprende">
                        <button className="bg-blue-500 rounded p-2">REGRESAR</button>
                    </Link>
                    <div className="text-4xl font-bold">Cuestionario {cuestionario?.id}</div>
                    <button className="bg-red-500 rounded p-2">SALIR</button>
                </div>
            </nav>
            <div className="min-h-screen bg-gray-100 flex items-start justify-center p-4">
                <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
                    <div className="relative overflow-hidden h-64">
                        <AnimatePresence custom={preguntaActiva}>
                            <motion.div
                                key={cuestionario?.preguntas[preguntaActiva].id}
                                className="absolute w-full h-full flex flex-col items-center justify-center"
                                variants={slideVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                custom={preguntaActiva}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-6xl">
                                    <h2 className="text-xl font-semibold text-center mb-4 text-black">
                                        {cuestionario?.preguntas[preguntaActiva].texto}
                                    </h2>
                                    <div className="flex flex-col items-center">
                                        {cuestionario?.preguntas[preguntaActiva].opciones.map((opcion) => {
                                            const seleccion = respuestaSeleccionada[preguntaActiva];
                                            const esCorrecta = opcion.id === seleccion.respuestaCorrecta;
                                            const esSeleccionada = opcion.id === seleccion.opcionSeleccionada;
                                            const colorClase = esSeleccionada
                                                ? esCorrecta
                                                    ? 'bg-green-500'
                                                    : 'bg-red-500'
                                                : esCorrecta
                                                    ? 'bg-green-500'
                                                    : 'bg-blue-500 hover:bg-blue-600';

                                            return (
                                                <button
                                                    key={opcion.id}
                                                    onClick={() => handleOpcionClick(opcion.id, opcion.esCorrecta)}
                                                    disabled={preguntasContestadas[preguntaActiva]} 
                                                    className={`m-2 px-4 py-2 rounded-full w-11/12 text-white ${colorClase}`}
                                                >
                                                    {opcion.texto}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <div className="mt-8 flex justify-between">
                        <button
                            onClick={anteriorPregunta}
                            disabled={preguntaActiva === 0}
                            className={`px-4 py-2 rounded-lg shadow-md ${
                                preguntaActiva === 0 ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                            } text-white`}
                        >
                            Anterior
                        </button>
                        <button
                            onClick={esUltimaPregunta ? finalizarCuestionario : siguientePregunta}
                            disabled={
                                (esUltimaPregunta && !todasPreguntasContestadas) ||
                                !cuestionario?.preguntas?.length
                            }
                            className={`px-4 py-2 rounded-lg shadow-md ${
                                (esUltimaPregunta && !todasPreguntasContestadas) || !cuestionario?.preguntas?.length
                                    ? 'bg-gray-400'
                                    : 'bg-blue-500 hover:bg-blue-600'
                            } text-white`}
                        >
                            {esUltimaPregunta ? 'Finalizar cuestionario' : 'Siguiente'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cuestionario;
