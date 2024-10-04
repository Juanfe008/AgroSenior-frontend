const API_URL = "http://localhost:3001/texto-guia/";

export const fetchLeccionById = async (id: string): Promise<Leccion> => {
    const response = await fetch(`${API_URL}${id}`);
    if (!response.ok) {
        throw new Error("Error al obtener la lección");
    }
    const data: Leccion = await response.json();
    return data;
};

//TODO: Obtener lecciones por nivel
