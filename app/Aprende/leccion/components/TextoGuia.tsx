'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from 'next/link';
import { LeccionData } from "../interfaces/Leccion";
import Navbar from "@/app/components/Navbar";

const TextoGuia: React.FC<LeccionData> = (leccion) => {
    const [cardActiva, setCardActiva] = useState(0);

    const siguienteCard = () => {
        const cards = leccion.cards ?? []; 
        if (cards.length > 0) {
            setCardActiva((prev) => (prev + 1) % cards.length);
        }
    };
    
    const anteriorCard = () => {
        const cards = leccion.cards ?? []; 
        if (cards.length > 0) {
            setCardActiva((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
        }
    };
    
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

    return (
        <div>
            <Navbar backRoute="/Aprende" title={leccion.title}/>
            {leccion.cards && leccion.cards.length > 0 ? (
                <div className="max-w-7xl mx-auto mt-4 px-4 py-10 bg-blue-200 rounded-md">
                    <div className="relative overflow-hidden h-80">
                        <AnimatePresence custom={cardActiva}>
                            <motion.div
                                key={leccion.cards[cardActiva].id}
                                className="absolute w-full h-full flex flex-col items-center justify-center"
                                variants={slideVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                custom={cardActiva}
                                transition={{ duration: 0.5 }}
                            >
                                <div
                                    className="bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-6xl flex flex-col items-center"
                                    style={{ height: "100%", minHeight: "300px" }}
                                >
                                    <h2 className="text-xl font-semibold text-center mb-4 text-black">
                                        {leccion.cards[cardActiva].title}
                                    </h2>
                                    {leccion.cards[cardActiva].imageUrl && (
                                        <div className="flex flex-col items-center">
                                            <Image
                                                src={leccion.cards[cardActiva].imageUrl}
                                                alt={leccion.cards[cardActiva].title}
                                                width={150}
                                                height={100}
                                                className="rounded-lg mb-4"
                                            />
                                        </div>
                                    )}
                                    <p className="text-black">{leccion.cards[cardActiva].content}</p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="mt-8 flex justify-between">
                        <button
                            onClick={anteriorCard}
                            disabled={cardActiva === 0}
                            className={`px-4 py-2 rounded-lg shadow-md ${
                                cardActiva === 0
                                    ? "bg-gray-400"
                                    : "bg-blue-500 hover:bg-blue-600"
                            } text-white`}
                        >
                            Anterior
                        </button>

                        {cardActiva === leccion.cards.length - 1 ? (
                            leccion.cuestionarioId ? (
                                <Link href={`/Aprende/cuestionario/${leccion.cuestionarioId}`}>
                                    <button className="px-4 py-2 rounded-lg shadow-md bg-green-500 hover:bg-green-600 text-white">
                                        Cuestionario
                                    </button>
                                </Link>
                            ) : (
                                <button className="px-4 py-2 rounded-lg shadow-md bg-green-500 hover:bg-green-600 text-white">
                                    Finalizar Lección
                                </button>
                            )
                        ) : (
                            <button
                                onClick={siguienteCard}
                                disabled={cardActiva === leccion.cards.length - 1}
                                className={`px-4 py-2 rounded-lg shadow-md ${
                                    cardActiva === leccion.cards.length - 1
                                        ? "bg-gray-400"
                                        : "bg-blue-500 hover:bg-blue-600"
                                } text-white`}
                            >
                                Siguiente
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <p>No hay contenido disponible</p>
            )}
        </div>
    );
};

export default TextoGuia;
