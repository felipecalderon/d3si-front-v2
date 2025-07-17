"use client"
import { useEffect, useState } from "react"
import { getAllStores } from "@/actions/stores/getAllStores"

const Filters = () => {
    const [stores, setStores] = useState<{ storeID: string; name: string }[]>([])

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const data = await getAllStores()
                setStores(data)
            } catch (error) {
                console.error("Error al cargar tiendas:", error)
            }
        }

        fetchStores()
    }, [])

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-4">
                <select
                    title="meses"
                    className="px-3 py-2 dark:bg-gray-800 bg-white rounded-lg shadow border text-sm min-w-0 flex-1 sm:flex-none"
                >
                    <option>Filtrar por mes</option>
                    <option>Enero</option>
                    <option>Febrero</option>
                    <option>Marzo</option>
                    <option>Abril</option>
                    <option>Mayo</option>
                    <option>Junio</option>
                    <option>Julio</option>
                    <option>Agosto</option>
                    <option>Septiembre</option>
                    <option>Octubre</option>
                    <option>Noviembre</option>
                    <option>Diciembre</option>
                </select>
                <select
                    title="años"
                    className="px-3 py-2 dark:bg-gray-800 bg-white rounded-lg shadow border text-sm min-w-0 flex-1 sm:flex-none"
                >
                    <option>Filtrar por año</option>
                    <option>2025</option>
                    <option>2024</option>
                    <option>2023</option>
                </select>
                <select title="tienda" className="px-4 py-2 dark:bg-gray-800 bg-white rounded shadow border">
                    <option>Filtrar por tienda</option>
                    {stores.map((store) => (
                        <option key={store.storeID} value={store.storeID}>
                            {store.name}
                        </option>
                    ))}
                </select>
            </div>
        </>
    )
}

export default Filters
