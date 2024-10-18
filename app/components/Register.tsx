import { useState } from 'react';
import { registerUser } from '../services/auth.service';

interface RegisterProps {
    onClose: () => void;
}

const Register: React.FC<RegisterProps> = ({ onClose }) => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>(''); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setError('');

        try {
            await registerUser({ username, email, password });
            onClose();
        } catch (error) {
            setError("Error al registrar el usuario.");
            console.error(error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg relative">
            <h2 className="text-2xl font-bold mb-4 text-black">Registrar</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>} {/* Mostrar errores */}
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
                    <label htmlFor="email" className="block text-sm font-medium text-black">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <div className="mb-4">
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-black">Confirmar Contraseña</label>
                    <input
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 border text-black border-gray-300 rounded"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Registrar</button>
            </form>
        </div>
    );
};

export default Register;
