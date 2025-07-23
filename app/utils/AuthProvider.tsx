"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Loading from "../components/Loading";

interface AuthContextType {
  isAuthenticated: boolean | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      router.replace("/");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // 🔹 Mientras se verifica el token, mostrar Loading
  if (isAuthenticated === null) return <Loading />;

  // 🔹 Si el usuario no está autenticado, no renderiza nada
  if (!isAuthenticated) return null;

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
