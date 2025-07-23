"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { HuertoService } from './services/huerto.service';

type Control = {
    id: number;
    filaIndex: number;
    light: number;
    water: number;
    nutrients: number;
    huertoId: number;
};

type Plant = {
    id: number;
    huertoId: number;
    plantTypeId: number;
    growthStage: number;
    plantHealth: number;
    positionX: number;
    positionY: number;
    growthStartTime: string;
    lastGrowthUpdate: string;
    growthDuration: number;
    fruitProductionTime: number;
    hasFruits: boolean;
    status: string;
    plantedAt: string;
    lastWatered: string | null;
    lastHarvested: string | null;
    createdAt: string;
    updatedAt: string;
    type: {
        id: number;
        name: string;
        light: number;
        water: number;
        nutrients: number;
        growthDuration: number;
        images: string[];
        precio: number;
    };
};

type SeedCatalog = {
    [key: string]: {
        name: string;
        light: number;
        water: number;
        nutrients: number;
        images: string[];
        precio: number;
    };
};

type Cell = {
    type: string;
    plantType: string | null;
    plantId: number | null;
    plantHealth: number;
    growthStage: number;
    fruitProductionTime: number;
    hasFruits: boolean;
};

const Huerto = () => {
    const [grid, setGrid] = useState<Cell[][]>(
        Array(5)
            .fill(null)
            .map(() =>
                Array(5).fill({
                    type: "empty",
                    plantType: null,
                    plantId: null,
                    plantHealth: 100,
                    growthStage: 0,
                    fruitProductionTime: 0,
                    hasFruits: false
                })
            )
    );
    const [controls, setControls] = useState(
        Array(5).fill({ light: 50, water: 50, nutrients: 50 })
    );
    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
    const [selectedPlant, setSelectedPlant] = useState<string | null>(null);
    const [points, setPoints] = useState(0);
    const [seedCatalog, setSeedCatalog] = useState<SeedCatalog>({});
    const [hoveredPlant, setHoveredPlant] = useState<string | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isDarkMode, setIsDarkMode] = useState(false);

    const huertoService = new HuertoService();

    // Detectar el modo oscuro del sistema
    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(darkModeMediaQuery.matches);
        
        const handleChange = (e: MediaQueryListEvent) => {
            setIsDarkMode(e.matches);
        };
        
        darkModeMediaQuery.addEventListener('change', handleChange);
        
        return () => {
            darkModeMediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    // Función para obtener el catálogo de semillas
    const getSeedCatalog = async () => {
        try {
            const catalog = await huertoService.getPlantCatalog();
            console.log("Catálogo de semillas:", catalog);

            const formattedCatalog: SeedCatalog = {};
            catalog.forEach((plant: any) => {
                formattedCatalog[`plant${plant.id}`] = {
                    name: plant.name,
                    light: plant.light,
                    water: plant.water,
                    nutrients: plant.nutrients,
                    images: plant.images,
                    precio: plant.precio,
                };
            });

            setSeedCatalog(formattedCatalog);
            return formattedCatalog;
        } catch (error) {
            console.error("Error al obtener el catálogo:", error);
            return null;
        }
    };

    // Función para inicializar el huerto
    const initializeHuerto = async () => {
        const userId = localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : 1;
        try {
            console.log("Obteniendo huerto...");
            const huerto = await huertoService.getHuerto(userId);
            console.log("Huerto obtenido:", huerto);

            const catalog = await getSeedCatalog();
            console.log("Catálogo obtenido:", catalog);

            if (!huerto || Object.keys(huerto).length === 0) {
                console.log("El huerto no existe. Creando uno nuevo...");
                const newHuerto = await huertoService.createHuerto(userId);
                console.log("Huerto creado:", newHuerto);
            } else {
                console.log("Huerto ya existe:", huerto);

                try {
                    const userPoints = await huertoService.getUserPoints(userId);
                    setPoints(userPoints);
                } catch (error) {
                    console.error("Error al obtener los puntos del usuario:", error);
                }

                const newControls = Array(5).fill({ light: 50, water: 50, nutrients: 50 });
                huerto.controls.forEach((control: Control) => {
                    newControls[control.filaIndex] = {
                        light: control.light,
                        water: control.water,
                        nutrients: control.nutrients,
                    };
                });
                setControls(newControls);

                const newGrid = Array(5)
                    .fill(null)
                    .map(() =>
                        Array(5).fill({
                            type: "empty",
                            plantType: null,
                            plantId: null,
                            plantHealth: 100,
                            growthStage: 0,
                            fruitProductionTime: 0,
                            hasFruits: false,
                        })
                    );

                huerto.plants.forEach((plant: Plant) => {
                    const { positionX, positionY, growthStage, plantHealth, hasFruits, id, type, status } = plant;
                    const plantTypeKey = `plant${type.id}`;

                    const isDead = status === 'dead';

                    newGrid[positionY][positionX] = {
                        type: isDead ? "dead" : "plant",
                        plantType: plantTypeKey,
                        plantId: id,
                        plantHealth,
                        growthStage,
                        fruitProductionTime: 0,
                        hasFruits,
                    };
                });

                setGrid(newGrid);
            }
        } catch (error) {
            console.error("Error al inicializar el huerto:", error);

            try {
                console.log("Intentando crear el huerto debido a un error...");
                const newHuerto = await huertoService.createHuerto(userId);
                console.log("Huerto creado después del error:", newHuerto);
            } catch (createError) {
                console.error("Error al crear el huerto:", createError);
            }
        }
    };

    useEffect(() => {
        initializeHuerto();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            updatePlantGrowth();
        }, 3000);
        return () => clearInterval(interval);
    }, [controls, grid]);

    const updateCell = (row: number, col: number, update: Partial<Cell>) => {
        const newGrid = grid.map((r, i) =>
            r.map((cell, j) => (i === row && j === col ? { ...cell, ...update } : cell))
        );
        setGrid(newGrid);
    };

    const handlePlantSelection = async (plantType: string) => {
        if (selectedCell) {
            const [row, col] = selectedCell;

            try {
                const userId = localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : 1;
                const plantTypeId = parseInt(plantType.replace('plant', ''));
                const plant = seedCatalog[plantType];
                
                if (!plant) {
                    throw new Error("Tipo de planta no encontrado en el catálogo");
                }

                if (points < plant.precio) {
                    alert("No tienes suficientes puntos para comprar esta planta.");
                    return;
                }

                const newPlant = await huertoService.plantSeed(
                    userId,
                    plantTypeId,
                    col,
                    row
                );

                updateCell(row, col, {
                    type: "plant",
                    plantType,
                    plantId: newPlant.id,
                    plantHealth: 100,
                    growthStage: 1,
                    fruitProductionTime: 0,
                    hasFruits: false,
                });

                const updatedPoints = points - plant.precio;
                setPoints(updatedPoints);

                console.log("Semilla plantada:", newPlant);
            } catch (error) {
                console.error("Error al plantar semilla:", error);
            }

            setSelectedCell(null);
            setSelectedPlant(null);
        }
    };

    const updatePlantGrowth = async () => {
        const newGrid = grid.map((row, rowIndex) =>
            row.map(async (cell) => {
                if (cell.type === "plant" && cell.plantType && cell.plantId !== null) {
                    const plant = seedCatalog[cell.plantType];
                    const rowControls = controls[rowIndex];
                    const healthAdjustment =
                        Math.abs(rowControls.light - plant.light) +
                        Math.abs(rowControls.water - plant.water) +
                        Math.abs(rowControls.nutrients - plant.nutrients);

                    const newHealth = Math.max(0, cell.plantHealth - healthAdjustment * 0.5);

                    try {
                        await huertoService.updatePlantHealth(cell.plantId, newHealth);
                    } catch (error) {
                        console.error("Error al actualizar la salud de la planta:", error);
                    }

                    if (newHealth <= 0) {
                        try {
                            await huertoService.killPlant(cell.plantId);
                            return { ...cell, type: "dead", growthStage: 0, plantHealth: 0, hasFruits: false };
                        } catch (error) {
                            console.error("Error al matar la planta:", error);
                            return cell;
                        }
                    }

                    const updatedPlant = await huertoService.updatePlantGrowth(cell.plantId);

                    return {
                        ...cell,
                        plantHealth: newHealth,
                        growthStage: updatedPlant.growthStage,
                        fruitProductionTime: updatedPlant.fruitProductionTime,
                        hasFruits: updatedPlant.hasFruits,
                    };
                }
                return cell;
            })
        );

        const resolvedGrid = await Promise.all(newGrid.map(row => Promise.all(row)));
        setGrid(resolvedGrid);
    };

    const handleRemovePlant = async (rowIndex: number, colIndex: number) => {
        const cell = grid[rowIndex][colIndex];

        if ((cell.type === "plant" || cell.type === "dead") && cell.plantId !== null) {
            try {
                const userId = localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : 1;

                await huertoService.removePlant(cell.plantId);

                updateCell(rowIndex, colIndex, {
                    type: "empty",
                    plantType: null,
                    plantId: null,
                    plantHealth: 100,
                    growthStage: 0,
                    fruitProductionTime: 0,
                    hasFruits: false,
                });

                console.log("Planta eliminada correctamente");
            } catch (error) {
                console.error("Error al eliminar la planta:", error);
            }
        } else {
            console.error("No se puede eliminar la planta: plantId es null o la celda no contiene una planta");
        }
    };

    const handleHarvestFruits = async (rowIndex: number, colIndex: number) => {
        const cell = grid[rowIndex][colIndex];

        if (cell.type === "plant" && cell.hasFruits && cell.plantId !== null) {
            try {
                const userId = localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : 1;

                const response = await huertoService.harvestFruits(cell.plantId);

                updateCell(rowIndex, colIndex, {
                    hasFruits: false,
                    fruitProductionTime: 0,
                });

                try {
                    const userPoints = await huertoService.getUserPoints(userId);
                    setPoints(userPoints);
                } catch (error) {
                    console.error("Error al actualizar los puntos:", error);
                }

                console.log("Frutos recolectados:", response);
            } catch (error) {
                console.error("Error al recolectar frutos:", error);
            }
        } else {
            console.error("No se pueden recolectar frutos: la planta no tiene frutos o no existe");
        }
    };

    const handleControlChange = async (control: 'light' | 'water' | 'nutrients', value: number) => {
        if (selectedRow !== null) {
            try {
                const userId = localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : 1;

                const updatedControls = {
                    ...controls[selectedRow],
                    [control]: value,
                };

                const response = await huertoService.updateControls(
                    userId,
                    selectedRow,
                    updatedControls
                );

                const newControls = [...controls];
                newControls[selectedRow] = updatedControls;
                setControls(newControls);

                console.log("Controles actualizados:", response);
            } catch (error) {
                console.error("Error al actualizar controles:", error);
            }
        }
    };

    const getGrowthProgress = (growthStage: number) => {
        return (growthStage / 3) * 100;
    };

    const cellContent = (cell: Cell) => {
        if (cell.type === "plant" && cell.plantType) {
            const plant = seedCatalog[cell.plantType];

            if (!plant) {
                return <div className="text-red-500">Error: Planta no encontrada.</div>;
            }

            const growthStageIndex = Math.floor(cell.growthStage) - 1;
            const imageIndex = Math.max(0, Math.min(growthStageIndex, plant.images.length - 1));

            return (
                <>
                    <img
                        src={plant.images[imageIndex]}
                        alt={plant.name}
                        className="w-20 h-20 object-contain"
                    />
                    <div className="w-full mt-2">
                        <progress
                            value={cell.plantHealth}
                            max={100}
                            className="w-full h-2 appearance-none bg-green-200 rounded [&::-webkit-progress-bar]:bg-red-200 [&::-webkit-progress-value]:bg-green-500 [&::-moz-progress-bar]:bg-green-500"
                        ></progress>
                        <progress
                            value={getGrowthProgress(cell.growthStage)}
                            max={100}
                            className="w-full h-2 appearance-none bg-blue-200 rounded mt-1 [&::-webkit-progress-bar]:bg-blue-200 [&::-webkit-progress-value]:bg-blue-500 [&::-moz-progress-bar]:bg-blue-500"
                        ></progress>
                        {cell.hasFruits && (
                            <div className="absolute top-0 right-0 p-1 bg-yellow-200 rounded-bl-lg">
                                🍎
                            </div>
                        )}
                    </div>
                </>
            );
        }
        if (cell.type === "dead") {
            return <img src="/images/huerto/maceta-muerta.png" alt="Muerta" className="w-20 h-20 object-contain" />;
        }
        if (cell.type === "empty") {
            return null;
        }
        if (cell.type === "pot" && !selectedPlant) {
            return <img src="/images/huerto/maceta.png" alt="Maceta Semilla" className="w-20 h-20 object-contain" />;
        }
        return null;
    };

    return (
        <div className={isDarkMode ? "dark" : ""}>
            <Navbar backRoute="ActionPanel" title="Huerto"></Navbar>
            <div className="flex h-screen text-black dark:text-white">
                {/* Sidebar con modo oscuro/claro */}
                <div className={`w-64 p-4 overflow-visible relative max-h-screen transition-colors duration-300 ${
                    isDarkMode 
                        ? "bg-gray-800 text-white" 
                        : "bg-gray-100 text-gray-800 border-r border-gray-200"
                }`} style={{ zIndex: 1 }}>
                    <h1 className="text-xl font-bold mb-4">Controles</h1>

                    {selectedCell && (
                        <div className="mt-4 relative">
                            <h2 className="text-lg font-bold">Select a Seed</h2>
                            {Object.entries(seedCatalog).map(([key, plant]) => (
                                <div
                                    key={key}
                                    className="relative"
                                    onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
                                    onMouseEnter={() => setHoveredPlant(key)}
                                    onMouseLeave={() => setHoveredPlant(null)}
                                >
                                    <button
                                        className={`block w-full text-left p-2 mt-2 rounded hover:bg-opacity-80 transition-colors ${
                                            isDarkMode 
                                                ? "bg-green-700 hover:bg-green-600" 
                                                : "bg-green-500 hover:bg-green-400 text-white"
                                        }`}
                                        onClick={() => handlePlantSelection(key)}
                                    >
                                        {plant.name}
                                    </button>

                                    {hoveredPlant === key && (
                                        <div
                                            className={`fixed w-64 p-4 rounded-lg shadow-lg border pointer-events-none ${
                                                isDarkMode 
                                                    ? "bg-gray-800 text-white border-gray-700" 
                                                    : "bg-white text-gray-800 border-gray-300"
                                            }`}
                                            style={{
                                                zIndex: 1000,
                                                left: `${mousePosition.x + 10}px`,
                                                top: `${mousePosition.y + 10}px`
                                            }}
                                        >
                                            <h3 className="font-bold text-lg mb-2">{plant.name}</h3>
                                            <img
                                                src={plant.images[plant.images.length - 1]}
                                                alt={plant.name}
                                                className="w-full h-32 object-contain mb-2"
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="flex items-center">
                                                    <span className="mr-2">🌞</span>
                                                    <span>Luz: {plant.light}%</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="mr-2">💧</span>
                                                    <span>Agua: {plant.water}%</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="mr-2">🌱</span>
                                                    <span>Nutrientes: {plant.nutrients}%</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="mr-2">⭐</span>
                                                    <span>Precio: {plant.precio} pts</span>
                                                </div>
                                            </div>
                                            <div className={`mt-2 text-sm ${
                                                isDarkMode ? "text-gray-300" : "text-gray-600"
                                            }`}>
                                                <p>Condiciones ideales para crecimiento óptimo.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {selectedCell !== null && (
                        <div className="mt-4">
                            <h2 className="text-lg font-bold">Herramientas</h2>
                            <button
                                className={`block w-full text-left p-2 mt-2 rounded hover:bg-opacity-80 ${
                                    isDarkMode 
                                        ? "bg-red-700 hover:bg-red-600" 
                                        : "bg-red-500 hover:bg-red-400 text-white"
                                }`}
                                onClick={() => {
                                    const [row, col] = selectedCell;
                                    handleRemovePlant(row, col);
                                }}
                            >
                                🗑️ Quitar planta seleccionada
                            </button>
                            <button
                                className={`block w-full text-left p-2 mt-2 rounded hover:bg-opacity-80 ${
                                    isDarkMode 
                                        ? "bg-blue-700 hover:bg-blue-600" 
                                        : "bg-blue-500 hover:bg-blue-400 text-white"
                                }`}
                                onClick={() => {
                                    const [row, col] = selectedCell;
                                    handleHarvestFruits(row, col);
                                }}
                            >
                                🍎 Recoger frutos de la planta seleccionada
                            </button>
                        </div>
                    )}

                    {selectedRow !== null && selectedCell === null && (
                        <>
                            <div className="mb-4">
                                <label className="block">🌞 Luz</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={controls[selectedRow].light}
                                    onChange={(e) => handleControlChange("light", parseInt(e.target.value))}
                                    className={`w-full mt-2 ${
                                        isDarkMode ? "accent-yellow-400" : "accent-yellow-500"
                                    }`}
                                />
                                <span>{controls[selectedRow].light}%</span>
                            </div>

                            <div className="mb-4">
                                <label className="block">💧 Agua</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={controls[selectedRow].water}
                                    onChange={(e) => handleControlChange("water", parseInt(e.target.value))}
                                    className={`w-full mt-2 ${
                                        isDarkMode ? "accent-blue-400" : "accent-blue-500"
                                    }`}
                                />
                                <span>{controls[selectedRow].water}%</span>
                            </div>

                            <div className="mb-4">
                                <label className="block">🌱 Nutrientes</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={controls[selectedRow].nutrients}
                                    onChange={(e) => handleControlChange("nutrients", parseInt(e.target.value))}
                                    className={`w-full mt-2 ${
                                        isDarkMode ? "accent-green-400" : "accent-green-500"
                                    }`}
                                />
                                <span>{controls[selectedRow].nutrients}%</span>
                            </div>
                        </>
                    )}

                    <h2 className={isDarkMode ? "text-yellow-300" : "text-yellow-600"}>⭐ Puntos: {points}</h2>
                </div>

                <div className="flex-1 p-4 overflow-auto text-sm bg-white dark:bg-gray-900">
                    {grid.map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            className={`flex justify-between mb-4 cursor-pointer p-2 rounded border-2 ${
                                selectedRow === rowIndex && selectedCell === null
                                    ? "border-indigo-500 bg-green-500 dark:bg-green-700"
                                    : "border-indigo-800 dark:border-indigo-400"
                            }`}
                            onClick={() => {
                                if (selectedCell) {
                                    setSelectedCell(null);
                                    setSelectedRow(rowIndex);
                                } else {
                                    setSelectedRow(rowIndex === selectedRow ? null : rowIndex);
                                }
                            }}
                        >
                            {row.map((cell, colIndex) => (
                                <div
                                    key={`${rowIndex}-${colIndex}`}
                                    className={`relative w-32 h-32 border flex flex-col items-center justify-center transition-all duration-200 ${
                                        cell.type === "empty" 
                                            ? "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" 
                                            : cell.type === "pot" 
                                                ? "bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-800 dark:hover:bg-yellow-700" 
                                                : cell.type === "dead" 
                                                    ? "bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700" 
                                                    : "bg-green-100 hover:bg-green-200 dark:bg-green-800 dark:hover:bg-green-700"
                                    }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (cell.type === "pot") {
                                            setSelectedCell([rowIndex, colIndex]);
                                            setSelectedRow(null);
                                        } else if (cell.type === "empty") {
                                            updateCell(rowIndex, colIndex, { type: "pot" });
                                            setSelectedRow(null);
                                        } else {
                                            setSelectedCell([rowIndex, colIndex]);
                                            setSelectedRow(null);
                                        }
                                    }}
                                >
                                    {cellContent(cell)}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Huerto;