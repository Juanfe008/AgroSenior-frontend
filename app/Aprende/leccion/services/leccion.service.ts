import { LeccionData } from "../interfaces/Leccion";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const API_URL = API_BASE_URL + "/leccion/";

export const fetchLeccionById = async (id: string): Promise<LeccionData> => {
    const response = await fetch(`${API_URL}${id}`);
    if (!response.ok) {
        throw new Error("Error al obtener la lección");
    }
    const data: LeccionData = await response.json();
    
    return data;
};

export const fetchLeccionesByNivel = async (nivelId: string, userId: string): Promise<LeccionData[]> => {
    const response = await fetch(`${API_URL}nivel/${nivelId}/usuario/${userId}`);
    if (!response.ok) {
        throw new Error("Error al obtener las lecciones por nivel");
    }
    const data: LeccionData[] = await response.json();
    
    return data;
};
