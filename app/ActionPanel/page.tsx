import Link from 'next/link';

const cards = [
    {src: 'images/Aprende.jpg', text: 'APRENDE', link: '/Aprende'},
    {src: 'images/Huerto.jpg', text: 'HUERTO', link: '/Huerto'},
    {src: 'images/Foro.jpg', text: 'FORO', link: '/Foro'},
    {src: 'images/Actividades.jpg', text: 'ACTIVIDADES', link: '/Actividades'},
    {src: 'images/Perfil.jpg', text: 'PERFIL', link: '/Profile'},
    {src: 'images/Configuración.jpg', text: 'CONFIGURACIÓN', link: '/Settings'},
]

export default function ActionPanel() {
    return (
        <div>
            {/* Navbar */}
            <nav className="bg-green-900 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-4xl font-bold">¿QUE QUIERES HACER?</div>
                    <button className="bg-red-500 rounded p-2">
                        SALIR
                    </button>
                </div>
            </nav>
            {/* Acciones */}
            <div className="container mx-auto mt-8 flex flex-wrap justify-center gap-4">
                <div className="flex flex-wrap justify-center gap-4">
                    {cards.slice(0, 3).map((card, index) => (
                        <Link key={index} href={card.link}>
                            <div className="w-64 h-64 flex flex-col items-center justify-center">
                                <img src={card.src} alt={`Card ${index + 1}`} className="w-full h-1/2 object-cover" />
                                <div className="w-full h-1/2 flex items-center justify-center bg-blue-500">
                                    <p className="text-center text-white">{card.text}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {cards.slice(3, 6).map((card, index) => (
                        <Link key={index} href={card.link}>
                            <div className="w-64 h-64 flex flex-col items-center justify-center">
                                <img src={card.src} alt={`Card ${index + 4}`} className="w-full h-1/2 object-cover" />
                                <div className="w-full h-1/2 flex items-center justify-center bg-blue-500">
                                    <p className="text-center text-white">{card.text}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}