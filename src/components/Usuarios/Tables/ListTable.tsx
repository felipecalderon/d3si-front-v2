"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useTienda } from "@/stores/tienda.store"
import { getAllUsers } from "@/actions/users/getAllUsers"
import { getAllStores } from "@/actions/stores/getAllStores"
import UsersTable from "./UsersTable"
import StoresTable from "./StoresTable"
import GastosTable from "./GastosTable"
import TableSkeleton from "../../ListTable/TableSkeleton"
import { useAuth } from "@/stores/user.store"

type ViewType = "initial" | "users" | "stores" | "gastos"

interface ListTableProps {
    defaultView?: ViewType
    onViewChange?: (view: ViewType) => void
}

export default function ListTable({ defaultView = "initial", onViewChange }: ListTableProps) {
    const { stores, setStores } = useTienda()
    const { users, setUsers } = useAuth()
    const [currentView, setCurrentView] = useState<ViewType>(defaultView)
    const [isLoading, setIsLoading] = useState(false)
    const [showSkeleton, setShowSkeleton] = useState(false)

    /**
     * Controla si se muestra el skeleton solo si tarda en cargar.
     * Mostrar skeleton si tarda más de 300ms.
     */

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (isLoading) {
            timer = setTimeout(() => setShowSkeleton(true), 300)
        } else {
            setShowSkeleton(false)
        }
        return () => clearTimeout(timer)
    }, [isLoading])

    useEffect(() => {
        if (defaultView !== "initial") {
            setCurrentView(defaultView)
            loadData(defaultView)
        }
    }, [defaultView])

    const loadData = async (view: ViewType) => {
        if (view === "initial" || view === "gastos") return

        setIsLoading(true)
        try {
            if (view === "users") {
                const usuarios = await getAllUsers()
                setUsers(usuarios)
            } else if (view === "stores") {
                const tiendas = await getAllStores()
                setStores(tiendas)
            }
        } catch (error) {
            console.error("Error loading data:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleViewChange = async (view: ViewType) => {
        setCurrentView(view)
        onViewChange?.(view)
        await loadData(view)
    }

    const renderInitialView = () => (
        <div className="bg-white lg:w-fit dark:bg-slate-800 rounded-lg shadow-sm px-6 py-4">
            <div className="text-center mb-6">
                <h3 className="text-xl font-semibold dark:text-white text-gray-800 mb-2">Panel de Gestión</h3>
                <p className="text-gray-600">Selecciona qué quieres gestionar para ver el listado correspondiente</p>
            </div>

            <div className="flex lg:flex-row flex-col justify-center gap-0">
                <Button
                    onClick={() => handleViewChange("users")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-l-md lg:rounded-r-none font-medium"
                >
                    Gestionar Usuarios
                </Button>
                <Button
                    onClick={() => handleViewChange("stores")}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 lg:rounded-none lg:mt-0 mt-2 font-medium"
                >
                    Gestionar Tiendas
                </Button>
                <Button
                    onClick={() => handleViewChange("gastos")}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-r-md lg:rounded-l-none lg:mt-0 mt-2 font-medium"
                >
                    Gestionar Gastos
                </Button>
            </div>

            {showSkeleton && (
                <div className="mt-8">
                    <TableSkeleton />
                </div>
            )}
        </div>
    )

    const renderContent = () => {
        if (currentView === "initial") {
            return renderInitialView()
        }

        return (
            <div>
                <div className="flex lg:flex-row flex-col justify-start lg:ml-8 gap-0 mb-6">
                    <Button
                        onClick={() => handleViewChange("users")}
                        className={`px-6 py-3 rounded-l-md lg:rounded-r-none font-medium ${
                            currentView === "users"
                                ? "bg-blue-600 text-white hover:bg-blue-800"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        Gestionar Usuarios
                    </Button>
                    <Button
                        onClick={() => handleViewChange("stores")}
                        className={`px-6 py-3 lg:rounded-none lg:mt-0 mt-2 font-medium ${
                            currentView === "stores"
                                ? "bg-green-600 text-white hover:bg-green-800"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        Gestionar Tiendas
                    </Button>
                    <Button
                        onClick={() => handleViewChange("gastos")}
                        className={`px-6 py-3 rounded-r-md lg:rounded-l-none lg:mt-0 mt-2 font-medium ${
                            currentView === "gastos"
                                ? "bg-purple-600 text-white hover:bg-purple-800"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        Gestionar Gastos
                    </Button>
                </div>

                {showSkeleton ? (
                    <TableSkeleton />
                ) : currentView === "users" ? (
                    <UsersTable users={users} />
                ) : currentView === "stores" ? (
                    <StoresTable />
                ) : (
                    <GastosTable />
                )}
            </div>
        )
    }

    return (
        <div className="mb-8">
            <h2 className="text-xl lg:text-start text-center lg:ml-8 font-semibold dark:text-white text-gray-800 mb-4">
                {currentView === "users" && "Usuarios Registrados"}
                {currentView === "stores" && "Tiendas Registradas"}
                {currentView === "gastos" && "Gastos Registrados"}
            </h2>
            {renderContent()}
        </div>
    )
}