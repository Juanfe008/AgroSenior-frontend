const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const API_URL = API_BASE_URL + "/cuestionarios/";

interface OpcionDto {
    texto: string;
    esCorrecta: boolean;
}

interface PreguntaDto {
    texto: string;
    opciones: OpcionDto[];
}

interface CreateCuestionarioDto {
    leccionId: number;
    preguntas?: PreguntaDto[];
}

interface CreateCuestionarioCompletadoDto {
    userId: number;
    cuestionarioId: number;
    expGanada: number;
}

export class CuestionarioAdminService {
    // Create new cuestionario
    async create(createCuestionarioDto: CreateCuestionarioDto) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(createCuestionarioDto),
            });

            if (!response.ok) {
                throw new Error('Error al crear el cuestionario');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Error en la conexión con el servidor');
        }
    }

    // Get all cuestionarios
    async findAll() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Error al obtener los cuestionarios');
            }
            return await response.json();
        } catch (error) {
            throw new Error('Error en la conexión con el servidor');
        }
    }

    // Get one cuestionario by id
    async findOne(id: number) {
        try {
            const response = await fetch(`${API_URL}${id}`);
            if (!response.ok) {
                throw new Error('Error al obtener el cuestionario');
            }
            return await response.json();
        } catch (error) {
            throw new Error('Error en la conexión con el servidor');
        }
    }

    // Update cuestionario
    async update(id: number, updateCuestionarioDto: CreateCuestionarioDto) {
        try {
            const response = await fetch(`${API_URL}${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateCuestionarioDto),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el cuestionario');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Error en la conexión con el servidor');
        }
    }

    // Delete cuestionario
    async remove(id: number) {
        try {
            const response = await fetch(`${API_URL}${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el cuestionario');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Error en la conexión con el servidor');
        }
    }
}
