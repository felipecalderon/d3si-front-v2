"use client"
import InventoryActions from "@/components/Inventory/HeaderSetion/InventoryActions"
import InventoryStats from "@/components/Inventory/HeaderSetion/InventoryStats"
import { inventoryStore } from "@/stores/inventory.store"
import { useAuth } from "@/stores/user.store"

interface InventoryHeaderProps {
    totalStockCentral: number
    filteredStockTotal: number
    uniqueProductsInCurrentPage: number
    searchedProductsLength: number
}

export default function InventoryHeader({
    totalStockCentral,
    filteredStockTotal,
    uniqueProductsInCurrentPage,
    searchedProductsLength,
}: InventoryHeaderProps) {
    const { rawProducts } = inventoryStore()
    const { user } = useAuth()

    return (
        <div className="flex flex-col gap-4 mb-6">
            {/* Title and Actions Row */}
            <div className="flex lg:flex-row flex-col items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Productos del Inventario</h1>

                {/* CREAR PRODUCTO Y DESCARGAR EXCEL, no se muestra si es store manager ni tercero */}
                {user?.role !== "store_manager" && user?.role !== "tercero" && (
                    <div className="h-11">
                        <InventoryActions products={rawProducts} />
                    </div>
                )}
            </div>
            {/* Stats Row */}
            <div className="flex items-center gap-4">
                <InventoryStats
                    totalStockCentral={totalStockCentral}
                    filteredStockTotal={filteredStockTotal}
                    uniqueProductsInCurrentPage={uniqueProductsInCurrentPage}
                    searchedProductsLength={searchedProductsLength}
                />
            </div>
        </div>
    )
}
