const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const API_URL = API_BASE_URL + "/actividades";

interface ActividadDto {
    title: string;
    desc: string;
    nivelMin: number;
    exp: number;
    tipo: string;
    evento: string | null;
    imageUrl?: string;
}

interface UpdateActividadDto {
    title?: string;
    desc?: string;
    nivelMin?: number;
    exp?: number;
    tipo?: string;
    evento?: string | null;
    imageUrl?: string;
}

export class ActividadAdminService {
    private getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    }

    async getAllActividades() {
        try {
            const response = await fetch(API_URL, {
                headers: this.getAuthHeaders(),
            });
            if (!response.ok) {
                throw new Error('Error al obtener las actividades');
            }
            return await response.json();
        } catch (error) {
            throw new Error('Error en la conexión con el servidor');
        }
    }

    async getActividadById(id: number) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                headers: this.getAuthHeaders(),
            });
            if (!response.ok) {
                throw new Error('Error al obtener la actividad');
            }
            return await response.json();
        } catch (error) {
            throw new Error('Error en la conexión con el servidor');
        }
    }

    async getAvailableActividades(userId: number) {
        try {
            const response = await fetch(`${API_URL}/disponibles/${userId}`, {
                headers: this.getAuthHeaders(),
            });
            if (!response.ok) {
                throw new Error('Error al obtener actividades disponibles');
            }
            return await response.json();
        } catch (error) {
            throw new Error('Error en la conexión con el servidor');
        }
    }

    async createActividad(createActividadDto: ActividadDto) {
        try {
            const response = await fetch(`${API_URL}/crear`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(createActividadDto),
            });

            if (!response.ok) {
                throw new Error('Error al crear la actividad');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Error en la conexión con el servidor');
        }
    }

    async updateActividad(id: number, updateActividadDto: UpdateActividadDto) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PATCH',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(updateActividadDto),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar la actividad');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Error en la conexión con el servidor');
        }
    }

    async deleteActividad(id: number) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la actividad');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Error en la conexión con el servidor');
        }
    }
}
