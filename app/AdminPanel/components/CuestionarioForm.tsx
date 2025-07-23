"use client";

import { useState } from "react";
import { CuestionarioAdminService } from "../services/cuestionario.service";

const CuestionarioForm = () => {
    const [leccionId, setLeccionId] = useState<number>(1);
    const [preguntas, setPreguntas] = useState<{texto: string, opciones: {texto: string, esCorrecta: boolean}[]}[]>([]);
    const [currentPregunta, setCurrentPregunta] = useState({
        texto: '',
        opciones: [] as {texto: string, esCorrecta: boolean}[]
    });
    const [currentOpcion, setCurrentOpcion] = useState({
        texto: '',
        esCorrecta: false
    });

    const cuestionarioService = new CuestionarioAdminService();

    const handleAddOpcion = () => {
        setCurrentPregunta({
            ...currentPregunta,
            opciones: [...currentPregunta.opciones, currentOpcion]
        });
        setCurrentOpcion({ texto: '', esCorrecta: false });
    };

    const handleAddPregunta = () => {
        if (currentPregunta.opciones.length > 0) {
            setPreguntas([...preguntas, currentPregunta]);
            setCurrentPregunta({ texto: '', opciones: [] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const cuestionarioData = {
                leccionId,
                preguntas
            };
            await cuestionarioService.create(cuestionarioData);
            alert('Cuestionario creado exitosamente');
            // Limpiar formulario
            setLeccionId(1);
            setPreguntas([]);
            setCurrentPregunta({ texto: '', opciones: [] });
        } catch (error) {
            alert('Error al crear el cuestionario');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Gestión de Cuestionarios</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">ID de la Lección:</label>
                    <input
                        type="number"
                        value={leccionId}
                        onChange={(e) => setLeccionId(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                {/* Sección de Preguntas */}
                <div className="border-t pt-4 mt-4">
                    <h4 className="text-lg font-semibold mb-2">Agregar Pregunta</h4>
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Texto de la pregunta"
                            value={currentPregunta.texto}
                            onChange={(e) => setCurrentPregunta({...currentPregunta, texto: e.target.value})}
                            className="w-full p-2 border rounded"
                        />

                        {/* Sección de Opciones */}
                        <div className="ml-4 border-l pl-4">
                            <h5 className="font-semibold mb-2">Agregar Opción</h5>
                            <input
                                type="text"
                                placeholder="Texto de la opción"
                                value={currentOpcion.texto}
                                onChange={(e) => setCurrentOpcion({...currentOpcion, texto: e.target.value})}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    checked={currentOpcion.esCorrecta}
                                    onChange={(e) => setCurrentOpcion({...currentOpcion, esCorrecta: e.target.checked})}
                                    className="mr-2"
                                />
                                <label>Es correcta</label>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddOpcion}
                                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                            >
                                Agregar Opción
                            </button>

                            {/* Lista de opciones actuales */}
                            {currentPregunta.opciones.length > 0 && (
                                <div className="mb-4">
                                    <h6 className="font-semibold">Opciones agregadas:</h6>
                                    <ul className="list-disc pl-5">
                                        {currentPregunta.opciones.map((opcion, index) => (
                                            <li key={index}>
                                                {opcion.texto} {opcion.esCorrecta ? '(Correcta)' : ''}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleAddPregunta}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Agregar Pregunta
                        </button>
                    </div>

                    {/* Lista de preguntas agregadas */}
                    {preguntas.length > 0 && (
                        <div className="mt-4">
                            <h5 className="font-semibold">Preguntas agregadas:</h5>
                            <ul className="list-disc pl-5">
                                {preguntas.map((pregunta, index) => (
                                    <li key={index}>{pregunta.texto}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                >
                    Crear Cuestionario
                </button>
            </form>
        </div>
    );
};

export default CuestionarioForm;
