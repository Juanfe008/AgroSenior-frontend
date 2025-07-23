const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

const API_URL = API_BASE_URL + "/users/";

export const fetchUserProfile = async () => {
    try {
        const response = await fetch(`${API_URL}profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
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

export const updateUsername = async (userId: number, username: string) => {
    try {
        const response = await fetch(`${API_URL}update`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ username }), // Envía el nuevo nombre de usuario
        });
        if (!response.ok) {
            throw new Error('Error al actualizar el nombre de usuario');
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