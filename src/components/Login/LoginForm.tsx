"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { login } from "@/actions/auth/authActions"
import { getAllUsers } from "@/actions/users/getAllUsers"
import { getAllStores } from "@/actions/stores/getAllStores"
import { useAuth } from "@/stores/user.store"
import { toast } from "sonner"
import { useTienda } from "@/stores/tienda.store"
import { Role } from "@/lib/userRoles"

export default function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()
    const { setUser, setUsers } = useAuth()
    const { setStores } = useTienda()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const data = await login(email, password)
            if (!data.cleanUsr) {
                toast.error("Email o contraseña incorrectos")
                return
            }

            // Guarda el usuario completo en Zustand
            setUser(data.cleanUsr)

            // 2. Cargar y guardar usuarios y tiendas
            const [usuarios, tiendas] = await Promise.all([getAllUsers(), getAllStores()])

            setUsers(usuarios)
            setStores(tiendas)

            toast.success("Inicio de sesión exitoso")
            if (data.cleanUsr.role === Role.Consignado) {
                return router.push("/home/purchaseOrder")
            }
            router.push("/home")
        } catch (err) {
            console.error(err)
            toast.error("Error inesperado al iniciar sesión")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                    Correo electrónico
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border dark:border-slate-600 dark:bg-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="password">
                    Contraseña
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border dark:border-slate-600 dark:bg-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <Button type="submit">Iniciar sesión</Button>
        </form>
    )
}
