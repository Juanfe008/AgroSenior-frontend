import { Actividad } from '../interfaces/actividad';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function fetchActividades(userId: number): Promise<Actividad[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/actividades/disponibles/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error(`Error fetching actividades: ${response.statusText}`);
    }
    return response.json();
}

export async function completeActivity(userId: number, actividadId: number): Promise<any> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/actividades/completar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, actividadId }),
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error completing actividad: ${response.status} - ${errorText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }

    return null;
}
