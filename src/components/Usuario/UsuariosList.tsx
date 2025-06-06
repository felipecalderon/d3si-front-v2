"use client"
import { useAuth } from "@/stores/user.store"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { Toaster } from 'react-hot-toast'
import { useState } from "react"
import { IUser } from "@/interfaces/users/IUser"
import { deleteUser } from "@/actions/auth/authActions"
import { getAllUsers } from "@/actions/users/getAllUsers"

export default function usersList() {
  const { users , setUsers} = useAuth()
  const [confirmingEmail, setConfirmingEmail] = useState<string | null>(null)
  
  const handleEdit = () => {
    // lógica para editar
  }

  const handleDelete = async (email: string) => {
    try{
     const data = await deleteUser(email)
                  
      if (data.error) {
        toast.error(data.error)
      } else {
        toast.success("Usuario eliminado exitosamente")
        const [usuarios] = await Promise.all([getAllUsers()])
        setUsers(usuarios)
      }
    } catch (error) {
          toast.error("Error al crear usuario")
          console.error(error)
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
            {users.map((usuario: IUser) => (
              <tr key={usuario.userID} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{usuario.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{usuario.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {usuario.Stores?.map((store) => store.name).join(", ") || "Sin tiendas"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    {confirmingEmail === usuario.email ? (
                      <>
                        <Button
                          onClick={() => handleDelete(usuario.email)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded"
                        >
                          Confirmar
                        </Button>
                        <Button
                          onClick={() => setConfirmingEmail(null)}
                          className="bg-gray-200 text-gray-800 px-3 py-1 text-xs rounded hover:bg-gray-300"
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleEdit()}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs rounded"
                        >
                          Editar
                        </Button>
                        <Button
                          onClick={() => setConfirmingEmail(usuario.email)}
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded"
                        >
                          Eliminar
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay usuarios registrados
        </div>
      )}
    </div>
  )
}