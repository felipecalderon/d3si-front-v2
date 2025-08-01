"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { useState } from "react"
import { IUser } from "@/interfaces/users/IUser"
import { deleteUser } from "@/actions/auth/authActions"
import { getAllUsers } from "@/actions/users/getAllUsers"
import GestionUserForm from "../Edit/GestionUserForm"
import { Edit, Trash2, User } from "lucide-react"
import { useAuth } from "@/stores/user.store"

interface UsersTableProps {
    users: IUser[]
}

export default function UsersTable({ users }: UsersTableProps) {
    const { setUsers } = useAuth()
    const [confirmingEmail, setConfirmingEmail] = useState<string | null>(null)
    const [editingUser, setEditingUser] = useState<IUser | null>(null)

    const handleEdit = (user: IUser) => {
        setEditingUser(user)
        setConfirmingEmail(null)
    }

    const handleCloseModal = () => {
        setEditingUser(null)
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
                <div className="text-center text-gray-500 py-8">
                    <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p>No hay usuarios registrados</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="dark:bg-slate-800 bg-white rounded-lg shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-slate-700">
                            <TableHead className="font-medium text-gray-500 uppercase tracking-wider">NOMBRE</TableHead>
                            <TableHead className="font-medium text-gray-500 uppercase tracking-wider">CORREO</TableHead>
                            <TableHead className="font-medium text-gray-500 uppercase tracking-wider">
                                TIENDAS
                            </TableHead>
                            <TableHead className="font-medium text-gray-500 uppercase tracking-wider">ACCIÓN</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((usuario: IUser) => (
                            <TableRow key={usuario.userID} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                <TableCell className="font-medium dark:text-white text-gray-900">
                                    {usuario.name}
                                </TableCell>
                                <TableCell className="text-blue-600">{usuario.email}</TableCell>
                                <TableCell className="text-gray-500 dark:text-white">
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
                                                    onClick={() => handleEdit(usuario)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs rounded flex items-center space-x-1"
                                                >
                                                    <Edit className="w-3 h-3" />
                                                    <span>Editar</span>
                                                </Button>
                                                <Button
                                                    onClick={() => setConfirmingEmail(usuario.email)}
                                                    variant="destructive"
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded flex items-center space-x-1"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    <span>Eliminar</span>
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Modal de edición */}
            {editingUser && <GestionUserForm isOpen={!!editingUser} onClose={handleCloseModal} usuario={editingUser} />}
        </>
    )
}
