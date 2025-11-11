"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { IProduct } from "@/interfaces/products/IProduct"
import { exportInventoryToExcel } from "@/utils/exportInventoryToExcel"
import { Button } from "@/components/ui/button"
import { CategoryManagementModal } from "@/components/CategorySection/EditCategory/CategoryManagementModal"

export default function InventoryActions({ products }: { products: IProduct[] }) {
    const router = useRouter()
    const [showCategoryModal, setShowCategoryModal] = useState(false)
    const handleDownloadExcel = () => {
        if (!products || products.length === 0) {
            alert("No hay productos para exportar.")
            return
        }
        exportInventoryToExcel(products)
    }

    return (
        <div className="flex gap-3">
            <Button onClick={() => setShowCategoryModal(true)} className="bg-gray-600 text-white px-4 py-2 rounded">
                Administrar Categorías
            </Button>
            <Button
                onClick={() => router.push("/home/inventory/create")}
                className="bg-green-600 text-white px-4 py-2 rounded"
            >
                Crear Producto
            </Button>
            <Button onClick={handleDownloadExcel} className="bg-blue-600 text-white px-4 py-2 rounded">
                Descargar Excel
            </Button>
            <CategoryManagementModal isOpen={showCategoryModal} onClose={() => setShowCategoryModal(false)} />
        </div>
    )
}
