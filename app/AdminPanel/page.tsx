"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import LeccionForm from "./components/LeccionForm";
import CuestionarioForm from "./components/CuestionarioForm";
import PlantTypeForm from "./components/PlantTypeForm";
import ActividadForm from "./components/ActividadForm";
import { LeccionAdminService } from "./services/leccion.service";
import { CuestionarioAdminService } from "./services/cuestionario.service";
import { PlantTypeAdminService } from "./services/plantType.service";
import { ActividadAdminService } from "./services/actividad.service";

const AdminPanel = () => {
    const [activeForm, setActiveForm] = useState<string | null>(null);
    const [activeAction, setActiveAction] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [lecciones, setLecciones] = useState([]);
    const [cuestionarios, setCuestionarios] = useState([]);
    const [plantTypes, setPlantTypes] = useState([]);
    const [actividades, setActividades] = useState([]);
    const actividadService = new ActividadAdminService();

    const leccionService = new LeccionAdminService();
    const cuestionarioService = new CuestionarioAdminService();
    const plantTypeService = new PlantTypeAdminService();

    useEffect(() => {
        if (activeForm === 'lecciones' && activeAction === 'view') {
            loadLecciones();
        } else if (activeForm === 'cuestionarios' && activeAction === 'view') {
            loadCuestionarios();
        } else if (activeForm === 'plantTypes' && activeAction === 'view') {
            loadPlantTypes();
        }
        else if (activeForm === 'actividades' && activeAction === 'view') {
            loadActividades();
        }
    }, [activeForm, activeAction]);

    const loadLecciones = async () => {
        try {
            const data = await leccionService.findAllLecciones();
            setLecciones(data);
        } catch (error) {
            alert('Error al cargar las lecciones');
        }
    };

    const loadCuestionarios = async () => {
        try {
            const data = await cuestionarioService.findAll();
            setCuestionarios(data);
        } catch (error) {
            alert('Error al cargar los cuestionarios');
        }
    };

    const loadPlantTypes = async () => {
        try {
            const data = await plantTypeService.getAllPlantTypes();
            setPlantTypes(data);
        } catch (error) {
            alert('Error al cargar los tipos de plantas');
        }
    };

    const loadActividades = async () => {
        try {
            const data = await actividadService.getAllActividades();
            setActividades(data);
        } catch (error) {
            alert('Error al cargar las actividades');
        }
    };

    const handleButtonClick = (formName: string, action: string = 'create') => {
        setActiveForm(formName === activeForm && action === activeAction ? null : formName);
        setActiveAction(action);
    };

    const handleDelete = async (type: string, id: number) => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar este ${type}?`)) {
            try {
                if (type === 'leccion') {
                    await leccionService.deleteLeccion(id);
                    await loadLecciones();
                } else if (type === 'cuestionario') {
                    await cuestionarioService.remove(id);
                    await loadCuestionarios();
                } else if (type === 'plantType') {
                    await plantTypeService.deletePlantType(id);
                    await loadPlantTypes();
                }
                else if (type === 'actividad') {
                    await actividadService.deleteActividad(id);
                    await loadActividades();
                }
                alert(`${type} eliminado exitosamente`);
            } catch (error) {
                alert(`Error al eliminar ${type}`);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar title="Admin" backRoute="/ActionPanel" />
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Lecciones */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Gestionar Lecciones</h2>
                        <div className="space-y-2">
                            <button
                                onClick={() => handleButtonClick('lecciones', 'create')}
                                className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Crear Lección
                            </button>
                            <button
                                onClick={() => handleButtonClick('lecciones', 'view')}
                                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Ver Lecciones
                            </button>
                        </div>
                    </div>

                    {/* Cuestionarios */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Gestionar Cuestionarios</h2>
                        <div className="space-y-2">
                            <button
                                onClick={() => handleButtonClick('cuestionarios', 'create')}
                                className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Crear Cuestionario
                            </button>
                            <button
                                onClick={() => handleButtonClick('cuestionarios', 'view')}
                                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Ver Cuestionarios
                            </button>
                        </div>
                    </div>

                    {/* Tipos de Plantas */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Gestionar Tipos de Plantas</h2>
                        <div className="space-y-2">
                            <button
                                onClick={() => handleButtonClick('plantTypes', 'create')}
                                className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Crear Tipo de Planta
                            </button>
                            <button
                                onClick={() => handleButtonClick('plantTypes', 'view')}
                                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Ver Tipos de Plantas
                            </button>
                        </div>
                    </div>

                    {/* Actividades */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Gestionar Actividades</h2>
                        <div className="space-y-2">
                            <button
                                onClick={() => handleButtonClick('actividades', 'create')}
                                className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Crear Actividad
                            </button>
                            <button
                                onClick={() => handleButtonClick('actividades', 'view')}
                                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Ver Actividades
                            </button>
                        </div>
                    </div>
                </div>

                {/* Contenedor de formularios y acciones */}
                <div className="mt-8">
                    {activeForm === 'lecciones' && activeAction === 'create' && <LeccionForm />}
                    {activeForm === 'cuestionarios' && activeAction === 'create' && <CuestionarioForm />}
                    {activeForm === 'plantTypes' && activeAction === 'create' && <PlantTypeForm />}
                    {activeForm === 'actividades' && activeAction === 'create' && <ActividadForm />}

                    {activeForm === 'lecciones' && activeAction === 'view' && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-2xl font-semibold mb-4">Lista de Lecciones</h3>
                            <div className="space-y-4">
                                {lecciones.map((leccion: any) => (
                                    <div key={leccion.id} className="border p-4 rounded flex justify-between items-center">
                                        <div>
                                            <h4 className="font-semibold">{leccion.title}</h4>
                                            <p className="text-gray-600">{leccion.desc}</p>
                                        </div>
                                        <div className="space-x-2">
                                            <button
                                                onClick={() => handleButtonClick('lecciones', 'edit')}
                                                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete('leccion', leccion.id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeForm === 'cuestionarios' && activeAction === 'view' && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-2xl font-semibold mb-4">Lista de Cuestionarios</h3>
                            <div className="space-y-4">
                                {cuestionarios.map((cuestionario: any) => (
                                    <div key={cuestionario.id} className="border p-4 rounded flex justify-between items-center">
                                        <div>
                                            <h4 className="font-semibold">Cuestionario {cuestionario.id}</h4>
                                            <p className="text-gray-600">Lección ID: {cuestionario.leccionId}</p>
                                        </div>
                                        <div className="space-x-2">
                                            <button
                                                onClick={() => handleButtonClick('cuestionarios', 'edit')}
                                                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete('cuestionario', cuestionario.id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeForm === 'plantTypes' && activeAction === 'view' && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-2xl font-semibold mb-4">Lista de Tipos de Plantas</h3>
                            <div className="space-y-4">
                                {plantTypes.map((plantType: any) => (
                                    <div key={plantType.id} className="border p-4 rounded flex justify-between items-center">
                                        <div>
                                            <h4 className="font-semibold">{plantType.name}</h4>
                                            <p className="text-gray-600">Duración: {plantType.growthDuration} días</p>
                                            <p className="text-gray-600">Precio: ${plantType.precio}</p>
                                        </div>
                                        <div className="space-x-2">
                                            <button
                                                onClick={() => handleButtonClick('plantTypes', 'edit')}
                                                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete('plantType', plantType.id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeForm === 'actividades' && activeAction === 'view' && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-2xl font-semibold mb-4">Lista de Actividades</h3>
                            <div className="space-y-4">
                                {actividades.map((actividad: any) => (
                                    <div key={actividad.id} className="border p-4 rounded flex justify-between items-center">
                                        <div>
                                            <h4 className="font-semibold">{actividad.title}</h4>
                                            <p className="text-gray-600">{actividad.desc}</p>
                                        </div>
                                        <div className="space-x-2">
                                            <button
                                                onClick={() => handleDelete('actividad', actividad.id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeForm === 'lecciones' && activeAction === 'edit' && (
                        <div>Componente para editar lecciones</div>
                    )}
                    {activeForm === 'cuestionarios' && activeAction === 'edit' && (
                        <div>Componente para editar cuestionarios</div>
                    )}
                    {activeForm === 'plantTypes' && activeAction === 'edit' && (
                        <div>Componente para editar tipos de plantas</div>
                    )}
                    {activeForm === 'actividades' && activeAction === 'edit' && (
                        <div>Componente para editar actividades</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
