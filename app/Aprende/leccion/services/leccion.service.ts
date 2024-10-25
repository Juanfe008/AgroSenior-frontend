import { LeccionData } from "../interfaces/Leccion";

const API_URL = "http://localhost:3001/leccion/";

export const fetchLeccionById = async (id: string): Promise<LeccionData> => {
    const response = await fetch(`${API_URL}${id}`);
    if (!response.ok) {
        throw new Error("Error al obtener la lección");
    }
    const data: LeccionData = await response.json();
    
    return data;
};

export const fetchLeccionesByNivel = async (nivelId: string): Promise<LeccionData[]> => {
    const response = await fetch(`${API_URL}nivel/${nivelId}`);
    if (!response.ok) {
        throw new Error("Error al obtener las lecciones por nivel");
    }
    const data: LeccionData[] = await response.json();
    
    return data;
};
