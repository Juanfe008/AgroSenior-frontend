"use client";

import { useEffect, useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import { useRouter } from "next/navigation";

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
      <nav className="bg-green-900 text-white p-4">
        <div className="container mx-auto flex justify-center items-center">
          <div className="text-4xl font-bold">AgroSenior</div>
        </div>
      </nav>
      {/* Body */}
      <div className="container mx-auto mt-8 bg-blue-500 p-6 rounded-lg relative">
        <div className="relative w-full h-64 overflow-hidden">
          <div
            className="flex transition-transform ease-in-out duration-700"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className="w-full flex-shrink-0 relative">
                <img
                  src={image.src}
                  alt={image.text}
                  className="object-cover w-full h-64"
                />
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <h1 className="text-white text-4xl font-bold bg-black bg-opacity-50 rounded p-2">{image.text}</h1>
                </div>
              </div>
            ))}
          </div>

          <button className="absolute top-0 bottom-0 left-0 flex items-center justify-center px-2 bg-black bg-opacity-50" onClick={prevImage}>
            &#8249;
          </button>
          <button className="absolute top-0 bottom-0 right-0 flex items-center justify-center px-2 bg-black bg-opacity-50" onClick={nextImage}>
            &#8250;
          </button>
        </div>

        <div>
          <p className="text-white p-2 rounded-full text-center text-3xl">Comienza Ahora!</p>
        </div>

        <div className="flex justify-center space-x-4 mt-8 pb-15">
          <button
            className="bg-purple-500 text-white py-4 px-12 rounded-lg text-4xl sm:text-2xl"
            onClick={handleRegisterClick}
          >
            Soy nuevo
          </button>
          <button
            className="bg-green-500 text-white py-4 px-12 rounded-lg text-4xl sm:text-2xl"
            onClick={handleLoginClick}
          >
            Ya tengo cuenta
          </button>
        </div>

        {/* Modal para Login o Register */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md relative w-full max-w-md">
              <button onClick={closeModal} className="absolute top-2 right-2 text-gray-600">
                ✖
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
