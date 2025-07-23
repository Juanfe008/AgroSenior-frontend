"use client";

import { useState } from "react";
import { LeccionAdminService } from "../services/leccion.service";

const LeccionForm = () => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [tipo, setTipo] = useState<'texto' | 'infografia'>('texto');
    const [nivelId, setNivelId] = useState<number>(1);
    const [cards, setCards] = useState<{title: string, content: string, imageUrl?: string}[]>([]);
    const [currentCard, setCurrentCard] = useState({title: '', content: '', imageUrl: ''});

    const leccionService = new LeccionAdminService();

    const handleAddCard = () => {
        setCards([...cards, currentCard]);
        setCurrentCard({title: '', content: '', imageUrl: ''});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const leccionData = {
                title,
                desc,
                imgUrl,
                tipo,
                nivelId,
                cards: cards.length > 0 ? cards : undefined
            };
            await leccionService.createLeccion(leccionData);
            alert('Lección creada exitosamente');
            // Limpiar formulario
            setTitle('');
            setDesc('');
            setImgUrl('');
            setTipo('texto');
            setNivelId(1);
            setCards([]);
        } catch (error) {
            alert('Error al crear la lección');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Gestión de Lecciones</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">Título:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2">Descripción:</label>
                    <textarea
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2">Tipo:</label>
                    <select
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value as 'texto' | 'infografia')}
                        className="w-full p-2 border rounded"
                    >
                        <option value="texto">Texto</option>
                        <option value="infografia">Infografía</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-2">Nivel ID:</label>
                    <input
                        type="number"
                        value={nivelId}
                        onChange={(e) => setNivelId(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                {/* Sección de Cards */}
                <div className="border-t pt-4 mt-4">
                    <h4 className="text-lg font-semibold mb-2">Agregar Cards</h4>
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Título del card"
                            value={currentCard.title}
                            onChange={(e) => setCurrentCard({...currentCard, title: e.target.value})}
                            className="w-full p-2 border rounded"
                        />
                        <textarea
                            placeholder="Contenido del card"
                            value={currentCard.content}
                            onChange={(e) => setCurrentCard({...currentCard, content: e.target.value})}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="text"
                            placeholder="URL de imagen del card"
                            value={currentCard.imageUrl}
                            onChange={(e) => setCurrentCard({...currentCard, imageUrl: e.target.value})}
                            className="w-full p-2 border rounded"
                        />
                        <button
                            type="button"
                            onClick={handleAddCard}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Agregar Card
                        </button>
                    </div>

                    {/* Lista de cards agregados */}
                    {cards.length > 0 && (
                        <div className="mt-4">
                            <h5 className="font-semibold">Cards agregados:</h5>
                            <ul className="list-disc pl-5">
                                {cards.map((card, index) => (
                                    <li key={index}>{card.title}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                >
                    Crear Lección
                </button>
            </form>
        </div>
    );
};

export default LeccionForm;
