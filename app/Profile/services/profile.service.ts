const API_URL = "http://localhost:3001/users/";

export const fetchUserProfile = async () => {
    try {
        const response = await fetch(`${API_URL}profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener el perfil del usuario');
        }
        const data = await response.json();
        return data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error('Error en la conexión con el servidor: ' + error.message);
        } else {
            throw new Error('Error en la conexión con el servidor: ' + String(error));
        }
    }
};