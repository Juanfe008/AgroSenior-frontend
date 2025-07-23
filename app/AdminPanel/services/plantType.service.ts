const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const API_URL = API_BASE_URL + "/huerto/plant-types";

interface PlantTypeDto {
    name: string;
    light: number;
    water: number;
    nutrients: number;
    growthDuration: number;
    images: string[];
    precio: number;
}

interface UpdatePlantTypeDto {
    name?: string;
    light?: number;
    water?: number;
    nutrients?: number;
    growthDuration?: number;
    images?: string[];
    precio?: number;
}

export class PlantTypeAdminService {
    // Get all plant types
    async getAllPlantTypes() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Error al obtener los tipos de plantas');
            }
            return await response.json();
        } catch (error) {
            throw new Error('Error en la conexión con el servidor');
        }
    }

    // Get plant type by id
    async getPlantTypeById(id: number) {
        try {
            const response = await fetch(`${API_URL}${id}`);
            if (!response.ok) {
                throw new Error('Error al obtener el tipo de planta');
            }
            return await response.json();
        } catch (error) {
            throw new Error('Error en la conexión con el servidor');
        }
    }

    // Create new plant type
    async createPlantType(createPlantTypeDto: PlantTypeDto) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(createPlantTypeDto),
            });

            if (!response.ok) {
                throw new Error('Error al crear el tipo de planta');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Error en la conexión con el servidor');
        }
    }

    // Update plant type
    async updatePlantType(id: number, updatePlantTypeDto: UpdatePlantTypeDto) {
        try {
            const response = await fetch(`${API_URL}${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatePlantTypeDto),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el tipo de planta');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Error en la conexión con el servidor');
        }
    }

    // Delete plant type
    async deletePlantType(id: number) {
        try {
            const response = await fetch(`${API_URL}${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el tipo de planta');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Error en la conexión con el servidor');
        }
    }
}
