/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Input } from "@/components/ui/input"
import InventoryActions from "@/components/Inventory/HeaderSetion/InventoryActions"
import { ListFilters } from "@/components/ListTable/ListFilters"
import InventoryStats from "@/components/Inventory/HeaderSetion/InventoryStats"
import { useAuth } from "@/stores/user.store"

interface InventoryHeaderProps {
    search: string
    setSearch: (value: string) => void
    rawProducts: any[]
    categories: any[]
    selectedFilter: any
    sortDirection: any
    selectedCategory: any
    selectedGenre: any
    setSelectedFilter: (val: any) => void
    setSortDirection: (val: any) => void
    setSelectedCategory: (val: any) => void
    setSelectedGenre: (val: any) => void
    clearFilters: () => void
    totalStockCentral: number
    uniqueProductsInCurrentPage: number
    searchedProductsLength: number
}

export default function InventoryHeader({
    search,
    setSearch,
    rawProducts,
    categories,
    selectedFilter,
    sortDirection,
    selectedCategory,
    selectedGenre,
    setSelectedFilter,
    setSortDirection,
    setSelectedCategory,
    setSelectedGenre,
    clearFilters,
    totalStockCentral,
    uniqueProductsInCurrentPage,
    searchedProductsLength,
}: InventoryHeaderProps) {
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
                {/* CREAR PRODUCTO Y DESCARGAR EXCEL, no se muestra si es store manager */}
                {user?.role !== "store_manager" && (
                    <div className="h-11">
                        <InventoryActions products={rawProducts} />
                    </div>
                )}
            </div>
            <ListFilters
                products={rawProducts}
                categories={categories}
                selectedFilter={selectedFilter}
                sortDirection={sortDirection}
                selectedCategory={selectedCategory}
                selectedGenre={selectedGenre}
                onFilterChange={setSelectedFilter}
                onSortDirectionChange={setSortDirection}
                onCategoryChange={setSelectedCategory}
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
