"use client"
import { useAuth } from "@/stores/user.store"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FaChevronDown, FaSignOutAlt, FaUser } from "react-icons/fa"

export default function Navbar() {
    const router = useRouter()
    const { user, logout } = useAuth()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        router.push("/")
        setIsMenuOpen(false)
    }

    return (
        <header className="w-full mb-4 lg:mb-6 relative">
            <div className="flex justify-between items-center px-4 lg:px-0">
                {/* Welcome Message - Hidden on mobile */}
                <div className="hidden lg:block">
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-200">
                        Bienvenido, {user?.name || "Usuario"}
                    </h1>
                </div>

                {/* Mobile: User info and controls */}
                <div className="flex items-center gap-2 lg:gap-6 ml-auto">
                    {/* Desktop Layout */}
                    <div className="hidden lg:flex items-center gap-6">
                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-red-600/80 hover:bg-red-600 transition-colors"
                        >
                            <FaSignOutAlt size={16} />
                            <span>Logout</span>
                        </button>

                        {/* User Info */}
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="font-semibold text-blue-600">{user?.name || "Usuario"}</p>
                            </div>
                            <Image
                                src="/brand/user-default.jpeg"
                                alt="User"
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                            />
                        </div>
                    </div>

                    {/* Mobile Layout - Dropdown Menu */}
                    <div className="relative top-2 -right-2 lg:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <Image
                                src="/brand/user-default.jpeg"
                                alt="User"
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                            />
                            <div className="text-left min-w-0">
                                <p className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate">
                                    {user?.name || "Usuario"}
                                </p>
                            </div>
                            <FaChevronDown
                                size={12}
                                className={`text-gray-500 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {/* Mobile Dropdown Menu */}
                        {isMenuOpen && (
                            <>
                                {/* Backdrop */}
                                <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />

                                {/* Dropdown Content */}
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-20">
                                    <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                                        <div className="flex items-center gap-3">
                                            <FaUser className="text-blue-600" size={20} />
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-200">
                                                    {user?.name || "Usuario"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-2">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 w-full p-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            <FaSignOutAlt size={16} />
                                            <span className="font-medium">Cerrar Sesión</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
