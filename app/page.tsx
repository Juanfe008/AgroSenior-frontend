"use client";

import { useEffect, useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, X } from "lucide-react"; // Importar iconos de Lucide React

const images = [
  { src: "/images/Carousel-1.jpg", text: "Crea tu huerto" },
  { src: "/images/Carousel-2.jpg", text: "Aprende" },
  { src: "/images/Foro.jpg", text: "Foro" },
  { src: "/images/Actividades.jpg", text: "Actividades" },
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLogin, setIsLogin] = useState<boolean>(true); // Controlar la vista de login/registro
  const [isModalOpen, setModalOpen] = useState(false); // Estado para controlar la apertura del modal
  const router = useRouter();

  // Función para avanzar la imagen automáticamente
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Cambiar cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  // Cambiar a la imagen anterior
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Cambiar a la imagen siguiente
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleLoginClick = () => {
    setIsLogin(true);
    setModalOpen(true);
  };

  const handleRegisterClick = () => {
    setIsLogin(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleLoginSuccess = () => {
    router.push("/ActionPanel");
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-green-900 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-center items-center">
          <div className="text-4xl font-bold">AgroSenior</div>
        </div>
      </nav>

      {/* Body */}
      <div className="container mx-auto mt-6 p-4">
        <div className="bg-blue-500 rounded-lg shadow-lg overflow-hidden">
          <div className="relative w-full h-96 overflow-hidden">
            <div
              className="flex transition-transform ease-in-out duration-700"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {images.map((image, index) => (
                <div key={index} className="w-full flex-shrink-0 relative">
                  <img
                    src={image.src}
                    alt={image.text}
                    className="object-cover w-full h-96"
                  />
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <h1 className="text-white text-5xl font-bold bg-black bg-opacity-50 rounded-lg p-4">
                      {image.text}
                    </h1>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition duration-300"
              onClick={prevImage}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition duration-300"
              onClick={nextImage}
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentImageIndex ? "bg-white" : "bg-gray-500"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>

          <div className="bg-blue-600 p-6 text-center">
            <p className="text-white text-4xl font-bold">
              ¡Comienza Ahora!
            </p>
          </div>
        </div>

        <div className="flex justify-center space-x-8 mt-8">
          <button
            className="bg-purple-500 text-white py-4 px-12 rounded-lg text-3xl hover:bg-purple-600 transition duration-300 transform hover:scale-105"
            onClick={handleRegisterClick}
          >
            Soy nuevo
          </button>
          <button
            className="bg-green-500 text-white py-4 px-12 rounded-lg text-3xl hover:bg-green-600 transition duration-300 transform hover:scale-105"
            onClick={handleLoginClick}
          >
            Ya tengo cuenta
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg relative w-full max-w-md">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition duration-300"
              >
                <X className="w-6 h-6" />
              </button>
              {isLogin ? (
                <Login onClose={closeModal} onLoginSuccess={handleLoginSuccess} />
              ) : (
                <Register onClose={closeModal} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}