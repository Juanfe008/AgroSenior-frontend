import { useState } from 'react';
import { loginUser } from '../services/auth.service';

interface LoginProps {
    onClose: () => void;
    onLoginSuccess: () => void; 
}

const Login: React.FC<LoginProps> = ({ onClose, onLoginSuccess }) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>(''); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const accessToken = await loginUser({ username, email: '', password });
            onLoginSuccess(); 
            onClose();
        } catch (error) {
            setError("Error al iniciar sesión.");
            console.error(error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg relative">
            <h2 className="text-2xl font-bold mb-4 text-black">Iniciar Sesión</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-black">Nombre de Usuario</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 border text-black border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-black">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 border text-black border-gray-300 rounded"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default Login;
