'use client';

import { useState, useCallback, memo } from 'react';
import { LeccionData } from '../interfaces/Leccion';
import Navbar from '@/app/components/Navbar';
import { X, Volume2, StopCircle, ClipboardCheck } from 'lucide-react';
import { useSettings } from '@/app/contexts/SettingsContext';
import Link from 'next/link';

interface DataItem {
  titulo: string;
  urbana: string;
  tradicional: string;
  position: { x: number; y: number };
}

const DATOS: DataItem[] = [
  {
    titulo: 'Ubicación',
    urbana: 'Dentro de ciudades, en azoteas, balcones o espacios urbanos adaptados',
    tradicional: 'En áreas rurales, campos abiertos y zonas dedicadas exclusivamente a la agricultura',
    position: { x: 25, y: 60 }
  },
  {
    titulo: 'Escala',
    urbana: 'Pequeña escala, producción localizada para consumo cercano',
    tradicional: 'Gran escala, producción masiva para distribución amplia',
    position: { x: 65, y: 80 }
  },
  {
    titulo: 'Tecnología',
    urbana: 'Manual o automatizada con sistemas hidropónicos y control ambiental',
    tradicional: 'Mecánica, industrializada con maquinaria pesada y técnicas convencionales',
    position: { x: 85, y: 45 }
  },
];

const Infografia: React.FC<LeccionData> = ({ title, desc, cuestionarioId }) => {
  const [activo, setActivo] = useState<number | null>(null);
  const [isReading, setIsReading] = useState(false);
  const { theme } = useSettings();
  const isDark = theme === 'dark';
  
  const handleClosePanel = useCallback(() => {
    setActivo(null);
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    }
  }, [isReading]);

  const toggleLectura = useCallback(() => {
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    } else if (activo !== null) {
      const item = DATOS[activo];
      const texto = `${item.titulo}. Agricultura Urbana: ${item.urbana}. Agricultura Tradicional: ${item.tradicional}`;
      
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'es-ES';
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => setIsReading(false);

      window.speechSynthesis.speak(utterance);
      setIsReading(true);
    }
  }, [isReading, activo]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-slate-50 to-blue-100'}`}>
      <Navbar backRoute="/Aprende" title={title} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className={`rounded-xl shadow-lg p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'}`}>
          <header className="text-center mb-6">
            <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${isDark ? 'text-blue-400' : 'text-blue-800'}`}>
              {title}
            </h1>
            <p className={isDark ? 'text-gray-300' : 'text-slate-600 max-w-3xl mx-auto'}>{desc}</p>
          </header>

          <div className={`relative min-h-[70vh] rounded-lg border-2 overflow-hidden ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-300'}`}>
            {/* Imagen de fondo de la infografía */}
            <img 
              src="https://res.cloudinary.com/djokk60my/image/upload/v1748032449/Dise%C3%B1o_sin_t%C3%ADtulo_2_gpj8lf.png" 
              alt="Comparación agricultura urbana vs tradicional"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            
            {/* Puntos interactivos */}
            {DATOS.map((item, index) => (
              <button
                key={item.titulo}
                onClick={() => setActivo(index)}
                className={`absolute w-10 h-10 rounded-full flex items-center justify-center transition-all
                  ${activo === index 
                    ? 'bg-blue-600 scale-125 ring-4 ring-blue-300' 
                    : isDark 
                      ? 'bg-red-600 hover:scale-110 ring-2 ring-gray-300' 
                      : 'bg-red-500 hover:scale-110 ring-2 ring-white'}
                  shadow-md`}
                style={{
                  left: `${item.position.x}%`,
                  top: `${item.position.y}%`,
                  transform: activo === index ? 'translate(-50%, -50%) scale(1.25)' : 'translate(-50%, -50%) scale(1)'
                }}
                aria-label={`Mostrar detalles sobre ${item.titulo}`}
              >
                <span className="text-white font-bold text-sm">{index + 1}</span>
              </button>
            ))}
            
            {/* Panel de información */}
            {activo !== null && (
              <div 
                className={`absolute bottom-6 left-6 right-6 p-6 rounded-xl shadow-xl z-20 animate-fade-in-up ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-blue-200'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className={`text-xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-800'}`}>
                    {DATOS[activo].titulo}
                  </h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={toggleLectura}
                      className={`p-2 rounded-full transition-colors ${isReading 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : isDark 
                          ? 'bg-gray-600 text-blue-400 hover:bg-gray-500' 
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                      aria-label={isReading ? "Detener lectura" : "Leer en voz alta"}
                    >
                      {isReading ? (
                        <StopCircle className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                    <button 
                      onClick={handleClosePanel}
                      className={`p-2 rounded-full ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-600' : 'text-slate-500 hover:text-slate-700'}`}
                      aria-label="Cerrar panel"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-600 border-gray-500' : 'bg-blue-50 border-blue-100'}`}>
                    <h4 className={`font-semibold text-lg mb-2 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                      Agricultura Urbana
                    </h4>
                    <p className={isDark ? 'text-gray-200' : 'text-slate-700'}>{DATOS[activo].urbana}</p>
                  </div>
                  <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-600 border-gray-500' : 'bg-green-50 border-green-100'}`}>
                    <h4 className={`font-semibold text-lg mb-2 ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                      Agricultura Tradicional
                    </h4>
                    <p className={isDark ? 'text-gray-200' : 'text-slate-700'}>{DATOS[activo].tradicional}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Leyenda */}
            <div className={`absolute top-4 left-4 px-3 py-2 rounded-lg shadow-sm text-sm ${isDark ? 'bg-gray-700/90 text-gray-200' : 'bg-white/90'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-3 h-3 rounded-full ${isDark ? 'bg-red-600' : 'bg-red-500'}`}></span>
                <span>Puntos interactivos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                <span>Seleccionado</span>
              </div>
            </div>
          </div>

          {/* Sección de ventajas */}
          <section className={`mt-8 p-6 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-slate-50 border-slate-200'}`}>
            <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-blue-400' : 'text-blue-800'}`}>
              Ventajas de la Agricultura Urbana
            </h2>
            <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <li className={`p-3 rounded-lg shadow-sm border ${isDark ? 'bg-gray-600 border-gray-500 text-gray-200' : 'bg-white border-slate-100'}`}>
                <strong className={isDark ? 'text-blue-400' : 'text-blue-600'}>Sostenibilidad:</strong> Menor huella de carbono al reducir el transporte
              </li>
              <li className={`p-3 rounded-lg shadow-sm border ${isDark ? 'bg-gray-600 border-gray-500 text-gray-200' : 'bg-white border-slate-100'}`}>
                <strong className={isDark ? 'text-blue-400' : 'text-blue-600'}>Control:</strong> Mayor supervisión de pesticidas y fertilizantes
              </li>
              <li className={`p-3 rounded-lg shadow-sm border ${isDark ? 'bg-gray-600 border-gray-500 text-gray-200' : 'bg-white border-slate-100'}`}>
                <strong className={isDark ? 'text-blue-400' : 'text-blue-600'}>Adaptabilidad:</strong> Mejor respuesta a cambios climáticos urbanos
              </li>
            </ul>
          </section>

          {/* Botón de cuestionario */}
          {cuestionarioId && (
            <div className="mt-6 flex justify-center">
              <Link
                href={`/Aprende/cuestionario/${cuestionarioId}`}
                className={`flex items-center px-6 py-3 rounded-lg shadow-md transition-all hover:shadow-lg ${isDark 
                  ? 'bg-emerald-700 text-white hover:bg-emerald-600' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
              >
                <ClipboardCheck className="w-5 h-5 mr-2" />
                Comenzar Cuestionario
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default memo(Infografia);