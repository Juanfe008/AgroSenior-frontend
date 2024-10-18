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

export const loginUser = async (credentials: UserCredentials): Promise<string> => {
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
    console.log("Access token:", data.access_token);
    return data.access_token;
};
