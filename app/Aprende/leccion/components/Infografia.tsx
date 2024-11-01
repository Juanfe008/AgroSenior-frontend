'use client';

import Link from 'next/link';
import { LeccionData } from '../interfaces/Leccion';
import Navbar from '@/app/components/Navbar';

const Infografia: React.FC<LeccionData> = (leccion) => {
    return (
        <div>
            <Navbar backRoute="/Aprende" title={leccion.title}/>
            <div className="max-w-7xl mx-auto mt-4 px-4 py-10 bg-blue-200 rounded-md">
                <p>{leccion.desc}</p>
            </div>
        </div>
    );
};

export default Infografia;
