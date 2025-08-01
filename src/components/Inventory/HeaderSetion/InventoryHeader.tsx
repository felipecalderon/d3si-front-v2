/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Input } from "@/components/ui/input"
import InventoryActions from "@/components/Inventory/HeaderSetion/InventoryActions"
import { ListFilters } from "@/components/ListTable/ListFilters"
import InventoryStats from "@/components/Inventory/HeaderSetion/InventoryStats"
import { inventoryStore } from "@/stores/inventory.store"
import { useProductFilter } from "@/stores/productsFilters"
import { useAuth } from "@/stores/user.store"

interface InventoryHeaderProps {
    totalStockCentral: number
    uniqueProductsInCurrentPage: number
    searchedProductsLength: number
}

export default function InventoryHeader({
    totalStockCentral,
    uniqueProductsInCurrentPage,
    searchedProductsLength,
}: InventoryHeaderProps) {
    const { rawProducts, search, setSearch } = inventoryStore()
    const {
        clearFilters,
        selectedFilter,
        setSelectedFilter,
        setSelectedGenre,
        setSortDirection,
        sortDirection,
        selectedGenre,
    } = useProductFilter()

    const { user } = useAuth()

    return (
        <div className="flex flex-col gap-4 mb-6">
            <div className="flex lg:flex-row flex-col items-center gap-4">
                <Input
                    type="text"
                    placeholder="Buscar producto o código EAN..."
                    className="flex-1 h-11 border-2 dark:bg-gray-800 bg-white px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {/* CREAR PRODUCTO Y DESCARGAR EXCEL, no se muestra si es store manager ni tercero */}
                {user?.role !== "store_manager" && user?.role !== "tercero" && (
                    <div className="h-11">
                        <InventoryActions products={rawProducts} />
                    </div>
                )}
            </div>
            <ListFilters
                products={rawProducts}
                selectedFilter={selectedFilter}
                sortDirection={sortDirection}
                selectedGenre={selectedGenre}
                onFilterChange={setSelectedFilter}
                onSortDirectionChange={setSortDirection}
                onGenreChange={setSelectedGenre}
                onClearFilters={clearFilters}
            />
            <div className="flex items-center gap-4">
                <InventoryStats
                    totalStockCentral={totalStockCentral}
                    uniqueProductsInCurrentPage={uniqueProductsInCurrentPage}
                    searchedProductsLength={searchedProductsLength}
                />
            </div>
        </div>
    )
}
