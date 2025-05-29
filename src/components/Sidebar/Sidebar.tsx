"use client"

import React from "react"
import { useRouter } from "next/navigation"

export default function Sidebar() {
    const router = useRouter()

    const handleLogout = () => {
        // Aquí se podra limpiar el estado de autenticación cuando exista
        router.push("/")
    }

    return (
        <aside className="w-64 bg-blue-900 text-white flex flex-col p-4">
            <div className="mb-6">
                <img src="/logo.png" alt="Logo" className="mb-4" />
                <p className="text-sm">
                    ¡Hola
                    <br />
                    <strong>Alejandro Contreras!</strong>
                </p>
            </div>

            <select className="text-black mb-4 p-2 rounded">
                <option>Tiendas Principales</option>
                <option>Terceros</option>
            </select>

            <nav className="flex flex-col gap-2">
                {[
                    "Caja",
                    "Inventario",
                    "Facturas",
                    "Cotizar",
                    "Crear OC",
                    "UTI",
                    "Control de Mando",
                    "Estado de Resultados",
                ].map((item) => (
                    <button key={item} className="bg-blue-700 hover:bg-blue-600 text-left px-4 py-2 rounded">
                        {item}
                    </button>
                ))}
            </nav>

            <button className="mt-auto bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded" onClick={handleLogout}>
                Cerrar Sesión
            </button>
        </aside>
    )
}
