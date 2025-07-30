"use client"
import { useTienda } from "@/stores/tienda.store"

const Filters = () => {
    const { stores } = useTienda()

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
                <select
                    title="meses"
                    className="px-3 py-2 dark:bg-gray-800 bg-white rounded-lg shadow border text-sm w-full sm:w-auto sm:min-w-[140px]"
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
                    className="px-3 py-2 dark:bg-gray-800 bg-white rounded-lg shadow border text-sm w-full sm:w-auto sm:min-w-[140px]"
                >
                    <option>Filtrar por año</option>
                    <option>2025</option>
                    <option>2024</option>
                    <option>2023</option>
                </select>

                <select
                    title="tienda"
                    className="px-3 py-2 dark:bg-gray-800 bg-white rounded-lg shadow border text-sm w-full sm:w-auto sm:min-w-[160px]"
                >
                    <option>Filtrar por tienda</option>
                    {stores.map((store) => (
                        <option key={store.storeID} value={store.storeID}>
                            {store.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default Filters
