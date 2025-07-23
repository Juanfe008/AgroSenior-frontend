import { useState } from 'react';
import { loginUser, requestPasswordReset } from '../services/auth.service';
import { Lock, User, ArrowLeft } from 'lucide-react';

interface LoginProps {
    onClose: () => void;
    onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose, onLoginSuccess }) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const { access_token, userId } = await loginUser({ username, email: '', password });
            localStorage.setItem('token', access_token);
            localStorage.setItem('userId', userId.toString());
            onLoginSuccess();
            onClose();
        } catch (error) {
            setError("Error al iniciar sesión. Verifica tus credenciales.");
            console.error(error);
        }
    };

    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await requestPasswordReset(email);
            alert("Se ha enviado un correo para recuperar tu contraseña.");
        } catch (error) {
            setError("Error al solicitar el restablecimiento de contraseña.");
            console.error(error);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
            {isForgotPassword ? (
                <>
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Recuperar Contraseña</h2>
                    {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                    <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Correo Electrónico
                            </label>
                            <div className="mt-1 relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ingresa tu correo electrónico"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Recuperar Contraseña
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => setIsForgotPassword(false)}
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center justify-center"
                        >
                            <ArrowLeft className="mr-2" size={16} />
                            Volver al Inicio de Sesión
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Iniciar Sesión</h2>
                    {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Nombre de Usuario
                            </label>
                            <div className="mt-1 relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ingresa tu nombre de usuario"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <div className="mt-1 relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ingresa tu contraseña"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Iniciar Sesión
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => setIsForgotPassword(true)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            ¿Olvidaste tu usuario o contraseña?
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Login;