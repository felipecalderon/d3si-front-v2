"use client"

import { useState } from "react"
import { coloresPolera, diseñosDisponibles } from "@/utils/tshirts"
import Image from "next/image"
import { toast } from "sonner"

interface IPolera {
    id: string
    nombre: string
    imagen: string
}

interface IDesign {
    id: string
    nombre: string
    imagen: string
}

export default function CreaTuPolera() {
    const [poleraSeleccionada, setPoleraSeleccionada] = useState<IPolera | null>(null)
    const [diseñoSeleccionado, setDiseñoSeleccionado] = useState<IDesign | null>(null)

    const [posX, setPosX] = useState(50)
    const [posY, setPosY] = useState(50)
    const [tamaño, setTamaño] = useState(100)

    const agregarCarrito = () =>{
        return toast("¡Agregado al carrito!")
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-900 p-4">
            <h1 className="text-3xl font-bold text-center mb-6">Crea tu Polera</h1>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
                {coloresPolera.map((polera) => (
                    <button title="button"
                        key={polera.id}
                        onClick={() => setPoleraSeleccionada(polera)}
                        className={`border rounded p-2 transition hover:scale-105 ${
                            poleraSeleccionada?.id === polera.id ? "border-blue-500" : "border-gray-300"
                        }`}
                    >
                        <Image
                            src={polera.imagen}
                            alt={polera.nombre}
                            width={200}
                            height={200}
                            className="h-24 object-contain"
                        />
                    </button>
                ))}
            </div>

            <div className="relative mx-auto w-[400px] h-[500px] border rounded overflow-hidden">
                {poleraSeleccionada && (
                    <Image
                        src={poleraSeleccionada.imagen}
                        alt={poleraSeleccionada.nombre}
                        width={400}
                        height={500}
                        className="w-[400px] h-[500px] object-contain"
                    />
                )}

                {diseñoSeleccionado && (
                    <Image
                        src={diseñoSeleccionado.imagen}
                        alt={diseñoSeleccionado.nombre}
                        width={tamaño}
                        height={tamaño}
                        className="absolute object-contain"
                        style={{
                            top: `${posY}%`,
                            left: `${posX}%`,
                            transform: "translate(-50%, -50%)",
                            width: `${tamaño}px`,
                            height: `${tamaño}px`,
                        }}
                    />
                )}
            </div>

            {diseñoSeleccionado && (
                <div className="flex flex-col items-center mt-4 gap-3">
                    <div className="flex items-center gap-2">
                        <label htmlFor="tamaño">Tamaño:</label>
                        <input
                            id="tamaño"
                            type="range"
                            min={50}
                            max={200}
                            value={tamaño}
                            onChange={(e) => setTamaño(parseInt(e.target.value))}
                            className="w-64"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="posX">Horizontal:</label>
                        <input
                            id="posX"
                            type="range"
                            min={0}
                            max={100}
                            value={posX}
                            onChange={(e) => setPosX(parseInt(e.target.value))}
                            className="w-64"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="posY">Vertical:</label>
                        <input
                            id="posY"
                            type="range"
                            min={0}
                            max={100}
                            value={posY}
                            onChange={(e) => setPosY(parseInt(e.target.value))}
                            className="w-64"
                        />
                    </div>


                    <button
                        onClick={() => setDiseñoSeleccionado(null)}
                        className="text-sm mt-2 text-red-600 hover:underline"
                    >
                        Quitar diseño
                    </button>
                </div>
            )}

            <h2 className="text-xl font-semibold mt-10 mb-3 text-center">Elige un diseño</h2>
            <div className="flex flex-wrap justify-center gap-3">
                {diseñosDisponibles.map((diseño) => (
                    <button
                        key={diseño.id}
                        onClick={() => {
                            setDiseñoSeleccionado(diseño)
                            setPosX(50)
                            setPosY(50)
                        }}
                        className={`border p-2 rounded hover:scale-105 transition ${
                            diseñoSeleccionado?.id === diseño.id ? "border-green-500" : "border-gray-300"
                        }`}
                    >
                        <Image
                            src={diseño.imagen}
                            alt={diseño.nombre}
                            width={100}
                            height={100}
                            className="h-24 object-contain"
                        />
                        <p className="text-xs text-center mt-1">{diseño.nombre}</p>
                    </button>
                ))}
            </div>

            <div className="text-center mt-8">
                <button type="button" onClick={agregarCarrito} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                    Agregar al carrito
                </button>
            </div>
        </div>
    )
}
