"use client"

import { useTienda } from "@/stores/tienda.store"

export default function TitleSelectedStore() {
    const { storeSelected } = useTienda()
    return (
        <h1 className="text-2xl font-bold dark:text-white text-gray-800 mb-4">
            Sección de Ventas para: {storeSelected?.name}
        </h1>
    )
}
