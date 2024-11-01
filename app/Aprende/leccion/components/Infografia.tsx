'use client';

import Link from 'next/link';
import { LeccionData } from '../interfaces/Leccion';

const Infografia: React.FC<LeccionData> = (leccion) => {
    return (
        <div>
            {/* Navbar */}
            <nav className="bg-green-900 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/Aprende">
                        <button className="bg-blue-500 rounded p-2">
                            REGRESAR
                        </button>
                    </Link>
                    <div className="text-4xl font-bold">{leccion.title}</div>
                    <button className="bg-red-500 rounded p-2">
                        SALIR
                    </button>
                </div>
            </nav>
            <div className="max-w-7xl mx-auto mt-4 px-4 py-10 bg-blue-200 rounded-md">
                <p>{leccion.desc}</p>
            </div>
        </div>
    );
};

export default Infografia;
