"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { login } from "@/actions/authActions/authActions"
import { useAuth } from "@/stores/user.store"
import { toast } from "sonner"

export default function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()
    const { setUser } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Login with:", { email, password })
        // Aquí irá la lógica real de login (fetch, auth, etc.)
        const data = await login(email, password)
        console.log(data)
        if (data.error) {
            toast.error(data.error)
        } else {
            setUser(data)
            router.push("home")
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
                    className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <Button type="submit">Iniciar sesión</Button>
        </form>
    )
}
