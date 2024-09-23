'use client'

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from 'next/link';
import { useParams } from 'next/navigation'; // Importa useParams

interface Seccion {
    id: number;
    titulo: string;
    descripcion: string;
    imagen?: string; // Hacer la imagen opcional
}

const secciones: Seccion[] = [
    {
        id: 1,
        titulo: "Sección 1",
        descripcion: "Qui est quis deserunt proident. Magna sint esse minim velit nisi duis anim adipisicing quis irure ullamco ex. Esse officia mollit voluptate quis adipisicing aliquip adipisicing. Labore aliqua tempor exercitation cillum Lorem aute fugiat mollit cupidatat irure do adipisicing cillum. Velit sit non fugiat nisi laborum excepteur.",
    },
    {
        id: 2,
        titulo: "Sección 2",
        descripcion: "Qui est quis deserunt proident. Magna sint esse minim velit nisi duis anim adipisicing quis irure ullamco ex. Esse officia mollit voluptate quis adipisicing aliquip adipisicing. Labore aliqua tempor exercitation cillum Lorem aute fugiat mollit cupidatat irure do adipisicing cillum. Velit sit non fugiat nisi laborum excepteur.",
    },
    {
        id: 3,
        titulo: "Sección 3",
        descripcion: "Qui est quis deserunt proident. Magna sint esse minim velit nisi duis anim adipisicing quis irure ullamco ex. Esse officia mollit voluptate quis adipisicing aliquip adipisicing. Labore aliqua tempor exercitation cillum Lorem aute fugiat mollit cupidatat irure do adipisicing cillum. Velit sit non fugiat nisi laborum excepteur.",
    },
    {
        id: 4,
        titulo: "Sección 4",
        descripcion: "Qui est quis deserunt proident. Magna sint esse minim velit nisi duis anim adipisicing quis irure ullamco ex. Esse officia mollit voluptate quis adipisicing aliquip adipisicing. Labore aliqua tempor exercitation cillum Lorem aute fugiat mollit cupidatat irure do adipisicing cillum. Velit sit non fugiat nisi laborum excepteur.",
        imagen: "/images/Huerto.jpg",
    },
];

const TextoGuia: React.FC = () => {
    const params = useParams(); // Obtiene los parámetros de la ruta
    const { id } = params; // Asumiendo que tu ruta es /leccion/[id]

    const [seccionActiva, setSeccionActiva] = useState(0);

    const siguienteSeccion = () => {
        setSeccionActiva((prev) => (prev + 1) % secciones.length);
    };

    const anteriorSeccion = () => {
        setSeccionActiva((prev) => (prev === 0 ? secciones.length - 1 : prev - 1));
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
                    {/* Utiliza el parámetro de la ruta en el título */}
                    <div className="text-4xl font-bold">Lección {id}</div>
                    <button className="bg-red-500 rounded p-2">
                        SALIR
                    </button>
                </div>
            </nav>
            <div className="max-w-7xl mx-auto mt-4 px-4 py-10 bg-blue-200 rounded-md">
                <div className="relative overflow-hidden h-80">
                    <AnimatePresence custom={seccionActiva}>
                        <motion.div
                            key={secciones[seccionActiva].id}
                            className="absolute w-full h-full flex flex-col items-center justify-center"
                            variants={slideVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            custom={seccionActiva}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-6xl flex flex-col items-center" style={{ height: '100%', minHeight: '300px' }}>
                                <h2 className="text-xl font-semibold text-center mb-4 text-black">
                                    {secciones[seccionActiva].titulo}
                                </h2>
                                {secciones[seccionActiva].imagen && (
                                    <div className="flex flex-col items-center">
                                        <Image
                                            src={secciones[seccionActiva].imagen}
                                            alt={secciones[seccionActiva].titulo}
                                            width={150}
                                            height={100}
                                            className="rounded-lg mb-4"
                                        />
                                        <p className="text-black">{secciones[seccionActiva].descripcion}</p>
                                    </div>
                                )}
                                {!secciones[seccionActiva].imagen && (
                                    <p className="text-black">{secciones[seccionActiva].descripcion}</p>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mt-8 flex justify-between">
                    <button
                        onClick={anteriorSeccion}
                        disabled={seccionActiva === 0}
                        className={`px-4 py-2 rounded-lg shadow-md ${seccionActiva === 0 ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white`}
                    >
                        Anterior
                    </button>
                    <button
                        onClick={siguienteSeccion}
                        disabled={seccionActiva === secciones.length - 1}
                        className={`px-4 py-2 rounded-lg shadow-md ${seccionActiva === secciones.length - 1 ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white`}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TextoGuia;
