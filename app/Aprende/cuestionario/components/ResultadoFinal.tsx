import React from 'react';
import Link from 'next/link';

interface ResultadoFinalProps {
    puntaje: number;
    totalPreguntas: number;
    calificacion: string;
    mensajeFinalizacion: string | null;
}

const ResultadoFinal: React.FC<ResultadoFinalProps> = ({
    puntaje,
    totalPreguntas,
    calificacion,
    mensajeFinalizacion,
}) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 p-6">
            <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full text-center transform transition-all duration-300 hover:scale-105 border border-gray-700">
                <h2 className="text-4xl font-bold text-blue-400 mb-6 animate-bounce">¡Cuestionario Finalizado!</h2>
                <div className="space-y-4">
                    <p className="text-2xl text-gray-300">
                        Puntaje: <span className="font-semibold text-blue-400">{puntaje}</span> / {totalPreguntas}
                    </p>
                    <p className="text-2xl text-gray-300">
                        Calificación: <span className="font-semibold text-green-400">{calificacion}%</span>
                    </p>
                </div>
                {mensajeFinalizacion && (
                    <p className="mt-6 text-lg text-gray-400 italic">{mensajeFinalizacion}</p>
                )}
                <Link href="/Aprende">
                    <button className="mt-8 px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300 shadow-lg hover:shadow-xl">
                        Volver al Inicio
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default ResultadoFinal;