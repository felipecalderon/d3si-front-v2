"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { toast } from "sonner"

export default function TiendasForm() {
    const [accion, setAccion] = useState("")
    const [tienda, setTienda] = useState("")
    const [gestor, setGestor] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Gestión de tienda:", { accion, tienda, gestor })
        
        // Aquí iría la lógica para gestionar tiendas
        try {
            // Simulación de acción
            if (accion === "agregar") {
                toast.success(`Tienda "${tienda}" agregada exitosamente`)
            } else if (accion === "editar") {
                toast.success(`Tienda "${tienda}" editada exitosamente`)
            } else if (accion === "eliminar") {
                toast.success(`Tienda "${tienda}" eliminada exitosamente`)
            }
            
            // Limpiar formulario
            setAccion("")
            setTienda("")
            setGestor("")
        } catch (error) {
            toast.error("Error al gestionar tienda")
            console.error(error)
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Gestionar tiendas y usuarios</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="accion">
                        Selecciona la acción a realizar
                    </label>
                    <select
                        id="accion"
                        value={accion}
                        onChange={(e) => setAccion(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="">Agregar</option>
                        <option value="agregar">Agregar</option>
                        <option value="editar">Editar</option>
                        <option value="eliminar">Eliminar</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="tienda">
                        Selecciona tienda
                    </label>
                    <select
                        id="tienda"
                        value={tienda}
                        onChange={(e) => setTienda(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="">Selecciona tienda</option>
                        <option value="Tienda Central">Tienda Central</option>
                        <option value="Tienda Norte">Tienda Norte</option>
                        <option value="Tienda Sur">Tienda Sur</option>
                        <option value="Tienda Este">Tienda Este</option>
                        <option value="Tienda Oeste">Tienda Oeste</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="gestor">
                        Gestor de la tienda
                    </label>
                    <select
                        id="gestor"
                        value={gestor}
                        onChange={(e) => setGestor(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="">Joven Dev</option>
                        <option value="Joven Dev">Joven Dev</option>
                        <option value="Katherine">Katherine</option>
                        <option value="Felipe">Felipe</option>
                        <option value="Alejandro">Alejandro</option>
                        <option value="Demo User">Demo User</option>
                    </select>
                </div>

                <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                    Agregar
                </Button>
            </form>
        </div>
    )
}