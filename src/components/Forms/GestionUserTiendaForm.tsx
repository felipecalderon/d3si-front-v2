"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { IUser } from "@/interfaces/users/IUser"
import { IStore } from "@/interfaces/stores/IStore"
import { useTienda } from "@/stores/tienda.store"
import { getAllUsers } from "@/actions/users/getAllUsers"
import { updateUser } from "@/actions/users/updateUser"
import { TableCell } from "../ui/table"
import { updateUserStore } from "@/actions/stores/updateUserStore"

interface GestorUserTiendaFormProps {
    usuario: IUser
    onCancel: () => void
}

export default function GestorUserTiendaForm({ usuario, onCancel }: GestorUserTiendaFormProps) {
    const { stores, setUsers } = useTienda()
    
    // Estados para los campos del formulario
    const [nombre, setNombre] = useState(usuario.name)
    const [tiendaSeleccionada, setTiendaSeleccionada] = useState(
        usuario.Stores && usuario.Stores.length > 0 ? usuario.Stores[0].storeID.toString() : ""
    )
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const storeID= tiendaSeleccionada ? (tiendaSeleccionada).toString() : "null"
            console.log(usuario.email);
            if (nombre !== usuario.name) {
                await updateUser(nombre,usuario.email)
            }else if (storeID !== "null"){
                await updateUserStore(usuario.userID.trim(), storeID.trim())
            }else{
                toast.success("No hay nada para actualizar")
            }   
                
                toast.success("Usuario actualizado exitosamente")
                // Actualizar la lista de usuarios
                const [usuarios] = await Promise.all([getAllUsers()])
                setUsers(usuarios)
                
                // Cerrar el formulario
                onCancel()
            // }
        } catch (error) {
            toast.error("Error al actualizar usuario")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const validateForm = () => {
        return nombre.trim() !== "" 
    }

    return (
        <>
            {/* Nombre */}
            <td className="px-6 py-4 whitespace-nowrap">
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-2 py-1 text-sm border bg-transparent border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nombre del usuario"
                    required
                />
            </td>

            <TableCell className="text-blue-600">
                {usuario.email}
            </TableCell>

            {/* Tiendas */}
            <td className="px-6 py-4 whitespace-nowrap">
                <select
                    title="tiendas"
                    value={tiendaSeleccionada}
                    onChange={(e) => setTiendaSeleccionada(e.target.value)}
                    className="w-full px-2 py-1 text-sm border bg-transparent border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Sin tienda asignada</option>
                    {stores.map((store: IStore) => (
                        <option key={store.storeID} value={store.storeID.toString()}>
                            {store.name}
                        </option>
                    ))}
                </select>
            </td>

            {/* Botones de acción */}
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex gap-2">
                    <Button
                        onClick={handleSubmit}
                        disabled={!validateForm() || isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Guardando..." : "Confirmar"}
                    </Button>
                    <Button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="bg-gray-200 text-gray-800 px-3 py-1 text-xs rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </Button>
                </div>
            </td>
        </>
    )
}