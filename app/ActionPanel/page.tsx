'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useSettings } from '../contexts/SettingsContext';

const cards = [
    { src: 'images/Aprende.jpg', text: 'APRENDE', link: '/Aprende' },
    { src: 'images/Huerto.jpg', text: 'HUERTO', link: '/Huerto' },
    { src: 'images/Foro.jpg', text: 'FORO', link: '/Foro' },
    { src: 'images/Actividades.jpg', text: 'ACTIVIDADES', link: '/Actividades' },
    { src: 'images/Perfil.jpg', text: 'PERFIL', link: '/Profile' },
    { src: 'images/Configuración.jpg', text: 'CONFIGURACIÓN', link: '/Settings' },
];

const ActionPanel: React.FC = () => {
    const { theme } = useSettings();
    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <Navbar title="¿QUE QUIERES HACER?" />
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card, index) => (
                        <Link key={index} href={card.link}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                whileHover={{ scale: 1.05, boxShadow: isDark ? '0px 10px 20px rgba(255, 255, 255, 0.1)' : '0px 10px 20px rgba(0, 0, 0, 0.2)' }}
                                whileTap={{ scale: 0.95 }}
                                className={`w-full h-64 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ${
                                    isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
                                }`}
                            >
                                <img
                                    src={card.src}
                                    alt={`Card ${index + 1}`}
                                    className={`w-full h-3/4 object-cover ${isDark ? 'opacity-90' : ''}`}
                                />
                                <div className={`w-full h-1/4 flex items-center justify-center ${
                                    isDark 
                                        ? 'bg-blue-800 hover:bg-blue-900' 
                                        : 'bg-blue-600 hover:bg-blue-700'
                                } transition-colors duration-300`}>
                                    <p className="text-center text-white font-semibold text-lg">{card.text}</p>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ActionPanel;