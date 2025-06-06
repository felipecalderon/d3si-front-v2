"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { register } from "@/actions/auth/authActions"
import { useAuth } from "@/stores/user.store"
import { toast } from "sonner"
import { getAllUsers } from "@/actions/users/getAllUsers"
import { useTienda } from "@/stores/tienda.store"

export default function RegistroForm() {
    const [nombre, setNombre] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("")

    const router = useRouter()
    const { setUsers, users } = useTienda()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Registro with:", { nombre, email, role, password })
        try {
            const data = await register(nombre, email, role, password)

            if (data.error) {
                toast.error(data.error)
            } else {
                toast.success("Usuario creado exitosamente")
                const [usuarios] = await Promise.all([getAllUsers()])
                setUsers(usuarios)
                // Limpiar formulario
                setNombre("")
                setEmail("")
                setPassword("")
                setRole("")
            }
        } catch (error) {
            toast.error("Error al crear usuario")
            console.error(error)
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Crear usuarios</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="nombre">
                        Nombre
                    </label>
                    <input
                        id="nombre"
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ingresa el nombre"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="ejemplo@gmail.com"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="password">
                        Clave
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="role">
                        Tipo de Usuario
                    </label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="">Seleccionar tipo</option>
                        <option value="admin">Admin</option>
                        <option value="store_manager">Store Manager</option>
                        <option value="consignado">Consignado</option>
                        <option value="tercero">Tercero</option>
                    </select>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                    Crear Usuario
                </Button>
            </form>
        </div>
    )
}
