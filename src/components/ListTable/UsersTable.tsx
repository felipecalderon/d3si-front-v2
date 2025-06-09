"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { useState } from "react"
import { IUser } from "@/interfaces/users/IUser"
import { deleteUser } from "@/actions/auth/authActions"
import { getAllUsers } from "@/actions/users/getAllUsers"
import { useTienda } from "@/stores/tienda.store"
import GestorUserTiendaForm from "../Forms/GestionUserTiendaForm"

interface UsersTableProps {
  users: IUser[]
}

export default function UsersTable({ users }: UsersTableProps) {
  const { setUsers } = useTienda()
  const [confirmingEmail, setConfirmingEmail] = useState<string | null>(null)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  
  const handleEdit = (userId: string) => {
    setEditingUserId(userId)
    setConfirmingEmail(null)
  }

  const handleCancelEdit = () => {
    setEditingUserId(null)
  }

  const handleDelete = async (email: string) => {
    try {
      const data = await deleteUser(email)
                    
      if (data.error) {
        toast.error(data.error)
      } else {
        toast.success("Usuario eliminado exitosamente")
        const [usuarios] = await Promise.all([getAllUsers()])
        setUsers(usuarios)
        setConfirmingEmail(null)
      }
    } catch (error) {
      toast.error("Error al eliminar usuario")
      console.error(error)
    }
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center text-gray-500">
          No hay usuarios registrados
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-medium text-gray-500 uppercase tracking-wider">NOMBRE</TableHead>
            <TableHead className="font-medium text-gray-500 uppercase tracking-wider">CORREO</TableHead>
            <TableHead className="font-medium text-gray-500 uppercase tracking-wider">TIENDAS</TableHead>
            <TableHead className="font-medium text-gray-500 uppercase tracking-wider">ACCIÓN</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((usuario: IUser) => (
            <TableRow key={usuario.userID} className="hover:bg-gray-50">
              {editingUserId === usuario.userID ? (
                <TableCell colSpan={4} className="p-0">
                  <GestorUserTiendaForm 
                    usuario={usuario} 
                    onCancel={handleCancelEdit}
                  />
                </TableCell>
              ) : (
                <>
                  <TableCell className="font-medium text-gray-900">
                    {usuario.name}
                  </TableCell>
                  <TableCell className="text-blue-600">
                    {usuario.email}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {usuario.Stores?.map((store) => store.name).join(", ") || "Sin tiendas"}
                  </TableCell>
                  <TableCell>
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
                            onClick={() => handleEdit(usuario.userID)}
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
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}