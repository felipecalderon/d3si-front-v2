"use client"

import { motion } from "framer-motion"
import LoginForm from "@/components/Login/LoginForm"
import { useAuth } from "@/stores/user.store"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTienda } from "@/stores/tienda.store"
import { toast } from "sonner"

export default function LoginPage() {
    const { user } = useAuth()
    const { storeSelected } = useTienda()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            if (storeSelected) {
                toast("Sesión guardada, redirgiendo...")
                router.push(`/home?storeID=${storeSelected.storeID}`)
            }
        }
    }, [user])
    return (
        <main className=" flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md dark:bg-slate-700 bg-white rounded-2xl shadow-2xl p-8"
            >
                <h1 className="text-2xl font-bold dark:text-white text-gray-800 mb-2 text-center">Iniciar sesión</h1>
                <p className="text-sm text-gray-500 mb-6 text-center">Acceso administrativo a D3SI Retail</p>
                <LoginForm />
                <p className="text-xs text-gray-400 text-center mt-6">© 2025 D3SI. Todos los derechos reservados.</p>
            </motion.div>
        </main>
    )
}
