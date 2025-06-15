// src/components/Inventory/inventoryActions.tsx
"use client"

import * as XLSX from "xlsx"
import { IProduct } from "@/interfaces/products/IProduct"
import { useRouter } from "next/navigation"

export default function InventoryActions({ products }: { products: IProduct[] }) {
    const router = useRouter()

    const handleDownloadExcel = () => {
        if (!products || products.length === 0) {
            alert("No hay productos para exportar.")
            return
        }

        const excelData = products.flatMap((product) =>
            product.ProductVariations.map((variation) => ({
                Producto: product.name,
                Talla: variation.sizeNumber,
                SKU: variation.sku,
                PrecioCosto: variation.priceCost,
                PrecioPlaza: variation.priceList,
                StockCentral: variation.stockQuantity,
                StockAgregado: variation.StoreProducts?.reduce((acc, sp) => acc + sp.quantity, 0) ?? 0,
            }))
        )

        const worksheet = XLSX.utils.json_to_sheet(excelData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario")

        XLSX.writeFile(workbook, "inventario.xlsx") // ✅ descarga directa
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
