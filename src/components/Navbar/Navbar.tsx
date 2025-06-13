"use client"
import { useAuth } from "@/stores/user.store"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function Navbar() {
    const router = useRouter()
    const { user, logout } = useAuth()

    const handleLogout = () => {
        logout()
        router.push("/")
    }

    return (
        <header className="w-full mb-6">
            <div className="flex justify-end items-center gap-6">
                {/* Botón logout */}
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg text-white bg-red-600/80 hover:bg-red-600 transition-colors"
                >
                    Logout
                </button>

                {/* Usuario */}
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="font-semibold text-blue-600">
                            {user?.name || "Usuario"}
                        </p>
                        {user?.message && (
                            <p className="text-sm text-muted-foreground">{user.message}</p>
                        )}
                    </div>
                    <Image
                        src="/brand/user-default.jpeg"
                        alt="User"
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                </div>
            </div>
        </header>
    )
}
