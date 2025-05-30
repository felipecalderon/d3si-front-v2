"use client"

import { useRouter } from "next/navigation"

export default function InventoryActions() {
    const router = useRouter()

    return (
        <div className="flex gap-2">
            <button
                onClick={() => router.push("/inventory/create")}
                className="bg-green-600 text-white px-4 py-2 rounded"
            >
                Crear Producto
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Descargar Excel</button>
        </div>
    )
}
