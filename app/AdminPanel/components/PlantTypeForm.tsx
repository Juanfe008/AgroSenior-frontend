"use client";

import { useState } from "react";
import { PlantTypeAdminService } from "../services/plantType.service";

const PlantTypeForm = () => {
    const [name, setName] = useState('');
    const [light, setLight] = useState(0);
    const [water, setWater] = useState(0);
    const [nutrients, setNutrients] = useState(0);
    const [growthDuration, setGrowthDuration] = useState(0);
    const [images, setImages] = useState<string[]>([]);
    const [currentImage, setCurrentImage] = useState('');
    const [precio, setPrecio] = useState(0);

    const plantTypeService = new PlantTypeAdminService();

    const handleAddImage = () => {
        if (currentImage) {
            setImages([...images, currentImage]);
            setCurrentImage('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const plantTypeData = {
                name,
                light,
                water,
                nutrients,
                growthDuration,
                images,
                precio
            };
            await plantTypeService.createPlantType(plantTypeData);
            alert('Tipo de planta creado exitosamente');
            // Limpiar formulario
            setName('');
            setLight(0);
            setWater(0);
            setNutrients(0);
            setGrowthDuration(0);
            setImages([]);
            setPrecio(0);
        } catch (error) {
            alert('Error al crear el tipo de planta');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Gestión de Tipos de Plantas</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">Nombre:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2">Luz requerida (1-100):</label>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={light}
                        onChange={(e) => setLight(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2">Agua requerida (1-100):</label>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={water}
                        onChange={(e) => setWater(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2">Nutrientes requeridos (1-100):</label>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={nutrients}
                        onChange={(e) => setNutrients(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2">Duración de crecimiento (días):</label>
                    <input
                        type="number"
                        min="1"
                        value={growthDuration}
                        onChange={(e) => setGrowthDuration(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2">Precio:</label>
                    <input
                        type="number"
                        min="0"
                        value={precio}
                        onChange={(e) => setPrecio(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                {/* Sección de Imágenes */}
                <div className="border-t pt-4 mt-4">
                    <h4 className="text-lg font-semibold mb-2">Agregar Imágenes</h4>
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="URL de la imagen"
                            value={currentImage}
                            onChange={(e) => setCurrentImage(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                        <button
                            type="button"
                            onClick={handleAddImage}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Agregar Imagen
                        </button>
                    </div>

                    {/* Lista de imágenes agregadas */}
                    {images.length > 0 && (
                        <div className="mt-4">
                            <h5 className="font-semibold">Imágenes agregadas:</h5>
                            <ul className="list-disc pl-5">
                                {images.map((image, index) => (
                                    <li key={index}>{image}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                >
                    Crear Tipo de Planta
                </button>
            </form>
        </div>
    );
};

export default PlantTypeForm;
