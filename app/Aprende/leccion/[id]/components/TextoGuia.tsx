'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from 'next/link';
import { useParams } from 'next/navigation'; 
import { fetchLeccionById } from "../../services/texto-guia.service";

const TextoGuia: React.FC = () => {
    const params = useParams(); 
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const [leccion, setLeccion] = useState<Leccion | null>(null);
    const [cardActiva, setCardActiva] = useState(0);

    useEffect(() => {
        const fetchLeccion = async () => {
            if (id) { 
                try {
                    const data = await fetchLeccionById(id);
                    setLeccion(data);
                } catch (error) {
                    console.error('Error fetching lección:', error);
                }
            }
        };

        fetchLeccion();
    }, [id]);

    const siguienteCard = () => {
        if (leccion) {
            setCardActiva((prev) => (prev + 1) % leccion.cards.length);
        }
    };

    const anteriorCard = () => {
        if (leccion) {
            setCardActiva((prev) => (prev === 0 ? leccion.cards.length - 1 : prev - 1));
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
            {/* Navbar */}
            <nav className="bg-green-900 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/Aprende">
                        <button className="bg-blue-500 rounded p-2">
                            REGRESAR
                        </button>
                    </Link>
                    {/* Utiliza el título de la lección en el título */}
                    <div className="text-4xl font-bold">{leccion ? leccion.title : 'Cargando...'}</div>
                    <button className="bg-red-500 rounded p-2">
                        SALIR
                    </button>
                </div>
            </nav>
            <div className="max-w-7xl mx-auto mt-4 px-4 py-10 bg-blue-200 rounded-md">
                <div className="relative overflow-hidden h-80">
                    {leccion && (
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
                                <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-6xl flex flex-col items-center" style={{ height: '100%', minHeight: '300px' }}>
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
                    )}
                </div>

                <div className="mt-8 flex justify-between">
                    <button
                        onClick={anteriorCard}
                        disabled={cardActiva === 0}
                        className={`px-4 py-2 rounded-lg shadow-md ${cardActiva === 0 ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white`}
                    >
                        Anterior
                    </button>
                    <button
                        onClick={siguienteCard}
                        disabled={cardActiva === (leccion ? leccion.cards.length - 1 : 0)}
                        className={`px-4 py-2 rounded-lg shadow-md ${cardActiva === (leccion ? leccion.cards.length - 1 : 0) ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white`}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TextoGuia;
