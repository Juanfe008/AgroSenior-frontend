const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const API_URL = API_BASE_URL + "/leccion/";


interface CardDto {
    title: string;
    content: string;
    imageUrl?: string;
}

interface CreateLeccionDto {
    title: string;
    desc: string;
    imgUrl?: string;
    tipo: 'texto' | 'infografia';
    nivelId: number;
    cards?: CardDto[];
}

export class LeccionAdminService {
    // Create new leccion
    async createLeccion(createLeccionDto: CreateLeccionDto) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(createLeccionDto),
            });

            if (!response.ok) {
                throw new Error('Error al crear la lección');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Error en la conexión con el servidor');
        }
    }

    // Get all lecciones
    async findAllLecciones() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Error al obtener las lecciones');
            }
            return await response.json();
        } catch (error) {
            throw new Error('Error en la conexión con el servidor');
        }
    }

    // Get one leccion by id
    async findOneLeccion(id: number) {
        try {
            const response = await fetch(`${API_URL}${id}`);
            if (!response.ok) {
                throw new Error('Error al obtener la lección');
            }
            return await response.json();
        } catch (error) {
            throw new Error('Error en la conexión con el servidor');
        }
    }

    // Get lecciones by nivel
    async findLeccionesByNivel(nivelId: number) {
        try {
            const response = await fetch(`${API_URL}nivel/${nivelId}`);
            if (!response.ok) {
                throw new Error('Error al obtener las lecciones del nivel');
            }
            return await response.json();
        } catch (error) {
            throw new Error('Error en la conexión con el servidor');
        }
    }

    // Update leccion
    async updateLeccion(id: number, updateLeccionDto: CreateLeccionDto) {
        try {
            const response = await fetch(`${API_URL}${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateLeccionDto),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar la lección');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Error en la conexión con el servidor');
        }
    }

    // Delete leccion
    async deleteLeccion(id: number) {
        try {
            const response = await fetch(`${API_URL}${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la lección');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Error en la conexión con el servidor');
        }
    }
}
