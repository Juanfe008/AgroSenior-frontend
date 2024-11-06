const API_URL = "http://localhost:3001/auth/";

interface UserCredentials {
    username: string;
    email: string;
    password: string;
}

export const registerUser = async (credentials: UserCredentials): Promise<void> => {
    const response = await fetch(`${API_URL}register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        throw new Error("Error al registrar el usuario");
    }

    const data = await response.json();
    console.log("User registered successfully:", data);
};

export const loginUser = async (credentials: UserCredentials): Promise<{ access_token: string; userId: number }> => {
    const response = await fetch(`${API_URL}login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        throw new Error("Error al iniciar sesión");
    }

    const data = await response.json();
    return { access_token: data.access_token, userId: data.userId };
};
