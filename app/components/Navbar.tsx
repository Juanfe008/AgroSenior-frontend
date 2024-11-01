import Link from "next/link";

interface NavbarProps {
    title: string;
    backRoute: string;
}

const Navbar: React.FC<NavbarProps> = ({ title, backRoute }) => {
    return (
        <div>
            <nav className="bg-green-900 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href={backRoute}>
                        <button className="bg-blue-500 rounded p-2">REGRESAR</button>
                    </Link>
                    <div className="text-4xl font-bold">{title}</div>
                    <button className="bg-red-500 rounded p-2">SALIR</button>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
