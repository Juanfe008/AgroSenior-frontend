'use client';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from 'next/link';
import { LeccionData } from "../interfaces/Leccion";
import Navbar from "@/app/components/Navbar";
import { ChevronLeft, ChevronRight, BookOpen, ClipboardCheck, Volume2, StopCircle } from 'lucide-react';
import { useSettings } from '@/app/contexts/SettingsContext';

const TextoGuia: React.FC<LeccionData> = (leccion) => {
    const [cardActiva, setCardActiva] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isReading, setIsReading] = useState(false);
    const { theme } = useSettings();
    const isDark = theme === 'dark';

    const cards = leccion.cards ?? [];

    const siguienteCard = () => {
        setDirection(1);
        setCardActiva((prev) => (prev + 1) % cards.length);
    };

    const anteriorCard = () => {
        setDirection(-1);
        setCardActiva((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
    };

    const toggleLectura = () => {
        if (isReading) {
            window.speechSynthesis.cancel();
            setIsReading(false);
        } else {
            const card = cards[cardActiva];
            const utterance = new SpeechSynthesisUtterance(`${card.title}. ${card.content}`);
            utterance.lang = 'es-ES';
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.volume = 1;

            utterance.onend = () => setIsReading(false);

            window.speechSynthesis.speak(utterance);
            setIsReading(true);
        }
    };

    const slideVariants = {
        hidden: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
            scale: 0.95
        }),
        visible: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: { duration: 0.3, ease: "easeInOut" }
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -100 : 100,
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.2, ease: "easeInOut" }
        }),
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-slate-50 to-blue-50'}`}>
            <Navbar backRoute="/Aprende" title={leccion.title} />

            <div className="max-w-4xl mx-auto px-4 py-8">
                {cards.length > 0 ? (
                    <div className="relative">
                        <AnimatePresence custom={direction}>
                            <motion.div
                                key={cardActiva}
                                custom={direction}
                                variants={slideVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="relative"
                            >
                                <div className={`rounded-xl shadow-lg p-6 md:p-8 border transition-all duration-300 hover:shadow-xl ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-slate-100'
                                    }`}>
                                    <div className="flex items-center mb-4">
                                        <BookOpen className="w-6 h-6 text-blue-600 mr-2" />
                                        <h2 className={`text-2xl font-bold ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>
                                            {cards[cardActiva].title}
                                        </h2>
                                    </div>

                                    {cards[cardActiva].imageUrl && (
                                        <div className="relative w-full mb-6 rounded-lg overflow-hidden shadow-md" style={{ aspectRatio: '16/9' }}>
                                            <Image
                                                src={cards[cardActiva].imageUrl}
                                                alt={cards[cardActiva].title}
                                                width={800}
                                                height={450}
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                            />
                                        </div>
                                    )}

                                    <div className={`prose max-w-none leading-relaxed whitespace-pre-line ${isDark ? 'text-gray-300' : 'text-slate-600 prose-slate'
                                        }`}>
                                        {cards[cardActiva].content}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex justify-between mt-8">
                            <button
                                onClick={anteriorCard}
                                disabled={cardActiva === 0}
                                className={`flex items-center px-6 py-3 rounded-lg transition-all ${cardActiva === 0
                                    ? isDark ? 'bg-gray-700 text-gray-500' : 'bg-slate-100 text-slate-400'
                                    : isDark
                                        ? 'bg-gray-700 text-blue-400 hover:bg-gray-600'
                                        : 'bg-white text-blue-600 shadow-md hover:shadow-lg hover:bg-blue-50'
                                    } ${cardActiva === 0 ? 'cursor-not-allowed' : ''}`}
                            >
                                <ChevronLeft className="w-5 h-5 mr-2" />
                                Anterior
                            </button>
                            <button
                                onClick={toggleLectura}
                                className={`flex items-center px-6 py-3 rounded-lg transition-all ${isReading
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                {isReading ? (
                                    <>
                                        <StopCircle className="w-5 h-5 mr-2" />
                                        Detener Lectura
                                    </>
                                ) : (
                                    <>
                                        <Volume2 className="w-5 h-5 mr-2" />
                                        Leer en Voz Alta
                                    </>
                                )}
                            </button>
                            {cardActiva === cards.length - 1 ? (
                                leccion.cuestionarioId ? (
                                    <Link
                                        href={`/Aprende/cuestionario/${leccion.cuestionarioId}`}
                                        className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg shadow-md hover:bg-emerald-700 transition-all hover:shadow-lg"
                                    >
                                        <ClipboardCheck className="w-5 h-5 mr-2" />
                                        Comenzar Cuestionario
                                    </Link>
                                ) : (
                                    <button className={`px-6 py-3 rounded-lg shadow-md transition-all ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-slate-800 text-white hover:bg-slate-900'
                                        }`}>
                                        Finalizar Lección
                                    </button>
                                )
                            ) : (
                                <button
                                    onClick={siguienteCard}
                                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all hover:shadow-lg"
                                >
                                    Siguiente
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center justify-center mt-6 space-x-2">
                            {cards.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-2 w-8 rounded-full transition-all duration-300 ${index === cardActiva ? 'bg-blue-600 w-12' : isDark ? 'bg-gray-600' : 'bg-blue-200'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className={`text-center py-12 rounded-xl shadow-lg ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-white text-slate-500'
                        }`}>
                        <p className="text-lg">No hay contenido disponible</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TextoGuia;