// src/components/Inventory/inventoryActions.tsx
"use client"

import * as XLSX from "xlsx"
import { IProduct } from "@/interfaces/products/IProduct"
import { useRouter } from "next/navigation"
import { exportInventoryToExcel } from "@/utils/exportInventoryToExcel"

export default function InventoryActions({ products }: { products: IProduct[] }) {
    const router = useRouter()

    const handleDownloadExcel = () => {
        if (!products || products.length === 0) {
            alert("No hay productos para exportar.")
            return
        }
        exportInventoryToExcel(products)
    }

    return (
        <div className="flex gap-2">
            <button
                onClick={() => router.push("/home/inventory/create")}
                className="bg-green-600 text-white px-4 py-2 rounded"
            >
                Crear Producto
            </button>
            <button onClick={handleDownloadExcel} className="bg-blue-600 text-white px-4 py-2 rounded">
                Descargar Excel
            </button>
        </div>
    )
}
