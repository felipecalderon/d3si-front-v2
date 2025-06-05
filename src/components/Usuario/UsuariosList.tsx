"use client"

import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { IUser } from "@/interfaces/users/IUser"
import { getAllUsers } from "@/actions/users/getAllUsers"

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState<IUser[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers()
        setUsuarios(users)
      } catch (error) {
        toast.error("Error al cargar usuarios")
      }
    }
    fetchUsers()
  }, [])

  const handleEdit = (usuario: IUser) => {
    toast.info(`Editando usuario: ${usuario.name}`)
    // lógica para editar
  }

  const handleDelete = (usuario: IUser) => {
    if (confirm(`¿Estás seguro de eliminar al usuario ${usuario.name}?`)) {
      setUsuarios((prev) => prev.filter(u => u.userID !== usuario.userID))
      toast.success(`Usuario ${usuario.name} eliminado`)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NOMBRE</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CORREO</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TIENDAS</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACCIÓN</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usuarios.map((usuario) => (
              <tr key={usuario.userID} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{usuario.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{usuario.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {usuario.Stores?.map((store) => store.name).join(", ") || "Sin tiendas"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(usuario)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs rounded">Editar</Button>
                    <Button onClick={() => handleDelete(usuario)} variant="destructive" className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded">Eliminar</Button>
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
