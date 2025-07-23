import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogOut } from "lucide-react";
import { useSettings } from '@/app/contexts/SettingsContext';

interface NavbarProps {
    title: string;
    backRoute?: string; 
}

const Navbar: React.FC<NavbarProps> = ({ title, backRoute }) => {
    const router = useRouter();
    const { theme } = useSettings();
    const isDark = theme === 'dark';

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/');
    };

    return (
        <div>
            <nav className={`${isDark ? 'bg-gray-800' : 'bg-green-900'} text-white p-4 shadow-lg`}>
                <div className="container mx-auto flex justify-between items-center">
                    {/* Botón REGRESAR */}
                    <div className="w-24">
                        {backRoute && (
                            <Link href={backRoute}>
                                <button className={`${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition duration-300 ease-in-out transform hover:scale-105`}>
                                    <ArrowLeft className="w-5 h-5" /> REGRESAR
                                </button>
                            </Link>
                        )}
                    </div>

                    {/* Título centrado */}
                    <div className="text-3xl font-bold text-center flex-grow">
                        {title}
                    </div>

                    {/* Botón SALIR */}
                    <div className="w-24 flex justify-end">
                        <button 
                            onClick={handleLogout}
                            className={`${isDark ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition duration-300 ease-in-out transform hover:scale-105`}
                        >
                            <LogOut className="w-5 h-5" /> SALIR
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;