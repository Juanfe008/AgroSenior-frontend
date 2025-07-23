const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const API_URL = API_BASE_URL + "/cuestionarios/";

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

export const registrarCuestionarioCompletado = async (userId: number, cuestionarioId: number, expGanada: number) => {
    try {
        const response = await fetch(`${API_URL}completar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, cuestionarioId, expGanada }),
        });

        if (!response.ok) {
            throw new Error('Error al registrar cuestionario completado');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        throw new Error('Error en la conexión con el servidor');
    }
};