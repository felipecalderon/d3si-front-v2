"use client"

import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { toast } from "sonner"

interface Usuario {
    id: number
    nombre: string
    correo: string
    tiendas: string
}

export default function UsuariosList() {
    // Datos de ejemplo - en una app real vendrían de la base de datos
    const [usuarios, setUsuarios] = useState<Usuario[]>([
        {
            id: 1,
            nombre: "Demo User",
            correo: "demooo@demo.com",
            tiendas: "--"
        },
        {
            id: 2,
            nombre: "Felipe",
            correo: "felipe@demo.com",
            tiendas: "--"
        },
        {
            id: 3,
            nombre: "Katherine",
            correo: "kathjics@gmail.com",
            tiendas: "--"
        },
        {
            id: 4,
            nombre: "Alejandro",
            correo: "alejandro@avocco.com",
            tiendas: "--"
        }
    ])

    const handleEdit = (usuario: Usuario) => {
        toast.info(`Editando usuario: ${usuario.nombre}`)
        // Aquí iría la lógica para editar el usuario
    }

    const handleDelete = (usuario: Usuario) => {
        if (confirm(`¿Estás seguro de eliminar al usuario ${usuario.nombre}?`)) {
            setUsuarios(usuarios.filter(u => u.id !== usuario.id))
            toast.success(`Usuario ${usuario.nombre} eliminado`)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                NOMBRE
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                CORREO
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                TIENDAS
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ACCIÓN
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {usuario.nombre}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                    {usuario.correo}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {usuario.tiendas}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleEdit(usuario)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs rounded"
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(usuario)}
                                            variant="destructive"
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded"
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {usuarios.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No hay usuarios registrados
                </div>
            )}
        </div>
    )
}