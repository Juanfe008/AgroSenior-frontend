const API_URL = "http://localhost:3001/cuestionarios/";

export const fetchCuestionario = async (id: number) => {    
    try {
        const response = await fetch(`${API_URL}${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener el cuestionario');
        }
        const data = await response.json();
        
        return data;

    } catch (error) {
        throw new Error('Error en la conexión con el servidor');
    }
};