"use client"
import { Badge } from "@/components/ui/badge"

interface InventoryStatsProps {
    totalStockCentral: number
    uniqueProductsInCurrentPage: number
    searchedProductsLength: number
}

export default function InventoryStats({
    totalStockCentral,
    uniqueProductsInCurrentPage,
    searchedProductsLength,
}: InventoryStatsProps) {
    return (
        <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm px-3 py-1">
                <span className="text-blue-600 dark:text-blue-400 font-bold">{totalStockCentral}</span>
                <span className="ml-1">productos en stock</span>
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1">
                <span className="text-gray-600 dark:text-gray-400">Mostrando:</span>
                <span className="ml-1 font-bold text-blue-600 dark:text-blue-400">{uniqueProductsInCurrentPage}</span>
                <span className="ml-1">de {searchedProductsLength} productos</span>
            </Badge>
        </div>
    )
}
