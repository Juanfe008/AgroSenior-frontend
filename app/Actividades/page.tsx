'use client';

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { fetchActividades, completeActivity } from "./services/actividades.service";
import { Actividad } from "./interfaces/actividad";
import { useSettings } from "../contexts/SettingsContext";
import Image from "next/image";

export default function Actividades() {
    const [actividades, setActividades] = useState<Actividad[]>([]);
    const [filteredActividades, setFilteredActividades] = useState<Actividad[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>("todas");
    const userId = parseInt(localStorage.getItem('userId') || '1');
    const { theme } = useSettings();
    const isDark = theme === 'dark';

    useEffect(() => {
        const loadActividades = async () => {
            try {
                const data = await fetchActividades(userId);
                setActividades(data);
                setFilteredActividades(data);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Error desconocido");
            } finally {
                setLoading(false);
            }
        };

        loadActividades();
    }, [userId]);

    useEffect(() => {
        if (filter === "todas") {
            setFilteredActividades(actividades);
        } else if (filter === "completadas") {
            setFilteredActividades(actividades.filter(actividad => actividad.completada));
        } else if (filter === "pendientes") {
            setFilteredActividades(actividades.filter(actividad => !actividad.completada));
        }
    }, [filter, actividades]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(e.target.value);
    };

    const handleCompleteActivity = async (actividadId: number) => {
        try {
            await completeActivity(userId, actividadId);
            const updatedActividades = actividades.map(actividad => 
                actividad.id === actividadId ? {...actividad, completada: true} : actividad
            );
            setActividades(updatedActividades);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error al completar la actividad");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <Navbar backRoute="ActionPanel" title="Actividades"></Navbar>
            <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-100'} min-h-screen py-10`}>
                <div className="max-w-6xl mx-auto">
                    <div className="mb-6">
                        <select 
                            value={filter} 
                            onChange={handleFilterChange}
                            className={`${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-300'} border rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            <option value="todas">Todas las actividades</option>
                            <option value="completadas">Actividades completadas</option>
                            <option value="pendientes">Actividades pendientes</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredActividades.map((actividad) => (
                            <div
                                key={actividad.id}
                                className={`${isDark ? 'bg-gray-800 shadow-gray-900' : 'bg-white'} shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300`}
                            >
                                {actividad.imageUrl && (
                                    <div className="mb-4">
                                        <Image
                                            src={actividad.imageUrl}
                                            alt={actividad.title}
                                            width={300}
                                            height={200}
                                            className="rounded-lg object-cover w-full h-48"
                                        />
                                    </div>
                                )}
                                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>{actividad.title}</h2>
                                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>{actividad.desc}</p>
                                <div className="flex justify-between items-center mb-4">
                                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Nivel mínimo: {actividad.nivelMin}</span>
                                    <span className={`text-sm font-semibold ${actividad.completada ? 'text-green-500' : 'text-red-500'}`}>
                                        {actividad.completada ? 'Completada' : 'Pendiente'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-blue-500">EXP: {actividad.exp}</span>
                                    {actividad.tipo === "fisica" && !actividad.completada && (
                                        <button 
                                            className={`${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold py-2 px-4 rounded`}
                                            onClick={() => handleCompleteActivity(actividad.id)}
                                        >
                                            Completar
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
