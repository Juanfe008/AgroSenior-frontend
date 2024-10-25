'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchLeccionById } from '../../services/leccion.service';
import { LeccionData } from '../../interfaces/Leccion';
import TextoGuia from './TextoGuia';
import Infografia from './Infografia';

const Leccion: React.FC = () => {
    const { id } = useParams();
    const [leccion, setLeccion] = useState<LeccionData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchLeccionById(Array.isArray(id) ? id[0] : id);
                setLeccion({ ...data, cards: data.cards || [] });
            } catch (error) {
                console.error('Error fetching lección:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <p>Cargando...</p>;
    if (!leccion) return <p>No se encontró la lección</p>;

    switch (leccion.tipo) {
        case 'texto':
            return <TextoGuia leccion={leccion} />;
        case 'infografia':
            return <Infografia leccion={leccion} />;
        default:
            return <p>Tipo de lección no reconocido</p>;
    }
};

export default Leccion;
