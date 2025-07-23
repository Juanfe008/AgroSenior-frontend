const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export class HuertoService {
    private baseUrl = API_BASE_URL + '/huerto';

    // Crear un huerto para un usuario
    async createHuerto(userId: number): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Error al crear huerto: ${response.statusText}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error en createHuerto:', error);
            throw error;
        }
    }

    // Obtener el huerto de un usuario
    async getHuerto(userId: number): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/${userId}`, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error(`Error al obtener huerto: ${response.statusText}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error en getHuerto:', error);
            throw error;
        }
    }

    // Obtener los puntos de un usuario
    async getUserPoints(userId: number): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/${userId}/points`, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error(`Error al obtener puntos: ${response.statusText}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error en getUserPoints:', error);
            throw error;
        }
    }

    // Obtener el catálogo de plantas disponibles
    async getPlantCatalog(): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/catalog`, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error(`Error al obtener catálogo: ${response.statusText}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error en getPlantCatalog:', error);
            throw error;
        }
    }

    // Actualizar los controles de luz, agua y nutrientes de una fila
    async updateControls(
        userId: number,
        filaIndex: number,
        controls: { light: number; water: number; nutrients: number }
    ): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/${userId}/controls`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ filaIndex, ...controls }),
            });
            if (!response.ok) {
                throw new Error(`Error al actualizar controles: ${response.statusText}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error en updateControls:', error);
            throw error;
        }
    }

    // Plantar una semilla en una posición específica
    async plantSeed(
        userId: number,
        plantTypeId: number,
        positionX: number,
        positionY: number
    ): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/${userId}/plant`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ plantTypeId, positionX, positionY }),
            });
            if (!response.ok) {
                throw new Error(`Error al plantar semilla: ${response.statusText}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error en plantSeed:', error);
            throw error;
        }
    }

    // Actualizar el crecimiento de una planta
    async updatePlantGrowth(plantId: number): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/plant/${plantId}`, {
                method: 'PATCH',
            });
            if (!response.ok) {
                throw new Error(`Error al actualizar crecimiento: ${response.statusText}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error en updatePlantGrowth:', error);
            throw error;
        }
    }

    // Eliminar una planta
    async removePlant(plantId: number): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/plant/${plantId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`Error al eliminar planta: ${response.statusText}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error en removePlant:', error);
            throw error;
        }
    }

    // Cosechar frutos de una planta
    async harvestFruits(plantId: number): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/plant/${plantId}/harvest`, {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error(`Error al cosechar frutos: ${response.statusText}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error en harvestFruits:', error);
            throw error;
        }
    }

    // Actualizar la salud de una planta
    async updatePlantHealth(plantId: number, plantHealth: number): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/plant/${plantId}/health`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ plantHealth }),
            });
            if (!response.ok) {
                throw new Error(`Error al actualizar salud: ${response.statusText}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error en updatePlantHealth:', error);
            throw error;
        }
    }

    // Matar una planta
    async killPlant(plantId: number): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/plant/${plantId}/kill`, {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error(`Error al matar planta: ${response.statusText}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error en killPlant:', error);
            throw error;
        }
    }
}