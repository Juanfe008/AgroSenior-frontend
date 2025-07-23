const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

const API_URL = API_BASE_URL + "/auth/";

interface UserCredentials {
    username: string;
    email: string;
    password: string;
}

interface RequestResetDto {
    email: string;
}

interface ResetPasswordDto {
    token: string;
    newPassword: string;
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

export const requestPasswordReset = async (email: string): Promise<void> => {
    const response = await fetch(`${API_URL}request-password-reset`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        throw new Error("Error al solicitar el restablecimiento de contraseña");
    }

    const data = await response.json();
    console.log("Password reset requested successfully:", data);
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    console.log("Nueva contraseña:", newPassword);
    
    const response = await fetch(`${API_URL}reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
        throw new Error("Error al restablecer la contraseña");
    }

    const data = await response.json();
    console.log("Password reset successfully:", data);
};
