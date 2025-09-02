import React from "react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, X, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface ColumnFiltersProps {
    filters: {
        producto: string
        marca: string
        categoria: string
        talla: string
        precioCosto: string
        precioPlaza: string
        ofertas: boolean
        stock: string
        stockAgregado: string
    }
    onFilterChange: (field: string, value: string | boolean) => void
    onClearFilters: () => void
    showPrecioCosto: boolean
    showStockAgregado: boolean
}

interface NumericInputProps {
    value: string
    onChange: (value: string) => void
    placeholder: string
    className?: string
}

function NumericInputWithArrows({ value, onChange, placeholder, className }: NumericInputProps) {
    const handleIncrement = () => {
        const currentValue = parseInt(value) || 0
        onChange((currentValue + 1).toString())
    }

    const handleDecrement = () => {
        const currentValue = parseInt(value) || 0
        if (currentValue > 0) {
            onChange((currentValue - 1).toString())
        }
    }

    return (
        <div className="relative">
            <Input
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`pr-8 ${className}`}
                onWheel={(e) => e.currentTarget.blur()}
            />
            <div className="absolute right-1 top-0 h-full flex flex-col">
                <Button
                    type="button"
                    onClick={handleIncrement}
                    className="h-1/2 px-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t transition-colors flex items-center justify-center"
                >
                    <ChevronUp className="w-3 h-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
                </Button>
                <Button
                    type="button"
                    onClick={handleDecrement}
                    className="h-1/2 px-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b transition-colors flex items-center justify-center"
                >
                    <ChevronDown className="w-3 h-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
                </Button>
            </div>
        </div>
    )
}

export function ColumnFilters({ filters, onFilterChange, onClearFilters }: ColumnFiltersProps) {
    const hasActiveFilters = filters
        ? Object.values(filters).some((value) => (typeof value === "string" ? value.trim() !== "" : value === true))
        : false

    return (
        <div className="bg-gray-50 dark:bg-slate-800 border-b sticky top-0 z-10">
            {/* Filter Row */}
            <div className="flex items-center px-2 py-2 gap-1 overflow-x-auto min-w-max">
                {/* PRODUCTO */}
                <div className="flex-1 w-64 px-1">
                    <Label className="text-xs text-slate-500 ml-2">Buscar por producto, SKU, género...</Label>
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 z-10" />
                        <Input
                            value={filters.producto}
                            onChange={(e) => onFilterChange("producto", e.target.value)}
                            className="h-8 pl-8 py-5 text-xs mt-2 border-gray-200 dark:hover:bg-slate-950 cursor-pointer focus:border-blue-500 bg-white dark:bg-slate-900"
                        />
                    </div>
                </div>

                {/* MARCA */}
                <div className="w-24 px-1">
                    <Label className="text-xs text-slate-500 ml-2">Marca...</Label>
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 z-10" />
                        <Input
                            value={filters.marca}
                            onChange={(e) => onFilterChange("marca", e.target.value)}
                            className="h-8 pl-8 py-5 text-xs mt-2 border-gray-200 dark:hover:bg-slate-950 cursor-pointer focus:border-blue-500 bg-white dark:bg-slate-900"
                        />
                    </div>
                </div>

                {/* CATEGORÍA */}
                <div className="w-32 px-1">
                    <Label className="text-xs text-slate-500 ml-2">Categoría...</Label>
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 z-10" />
                        <Input
                            value={filters.categoria}
                            onChange={(e) => onFilterChange("categoria", e.target.value)}
                            className="h-8 pl-8 py-5 text-xs mt-2 border-gray-200 dark:hover:bg-slate-950 cursor-pointer focus:border-blue-500 bg-white dark:bg-slate-900"
                        />
                    </div>
                </div>

                {/* TALLA */}
                <div className="w-20 px-1">
                    <Label className="text-xs text-slate-500 ml-2">Talla...</Label>
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 z-10" />
                        <Input
                            value={filters.talla}
                            onChange={(e) => onFilterChange("talla", e.target.value)}
                            className="h-8 pl-8 py-5 text-xs mt-2 border-gray-200 dark:hover:bg-slate-950 cursor-pointer focus:border-blue-500 bg-white dark:bg-slate-900"
                        />
                    </div>
                </div>
                {/* OFERTAS */}
                {/* <div className="w-20 px-1 flex justify-center">
                    <div className="flex flex-col py-4 px-2 rounded-md bg-white dark:hover:bg-slate-950 cursor-pointer dark:bg-slate-900 items-center space-x-1">
                        <Checkbox
                            id="ofertas-filter"
                            checked={filters.ofertas}
                            onCheckedChange={(checked) => onFilterChange("ofertas", checked as boolean)}
                            className="w-4 h-4 my-auto"
                        />
                        <Label
                            htmlFor="ofertas-filter"
                            className="text-xs mt-2 whitespace-nowrap text-gray-600 dark:text-gray-300"
                        >
                            Con oferta
                        </Label>
                    </div>
                </div> */}

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                    <div className="flex py-5 px-2 rounded-md bg-red-500 dark:hover:bg-red-600 cursor-pointer dark:bg-red-700 flex-shrink-0">
                        <button
                            onClick={onClearFilters}
                            className="h-8 px-2 text-xs flex flex-col items-center gap-1 text-white whitespace-nowrap"
                        >
                            <X className="w-3 h-3" />
                            Limpiar
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

// Helper function to apply filters - ACTUALIZADA para búsqueda exacta en campos numéricos
export function applyColumnFilters(products: any[], filters: any) {
    return products.filter((product) => {
        // PRODUCTO filter (name, sku, genre)
        if (filters.producto.trim()) {
            const searchTerm = filters.producto.toLowerCase()
            const nameMatch = product.name.toLowerCase().includes(searchTerm)
            const skuMatch = product.ProductVariations.some((v: any) => v.sku === searchTerm)
            const genreMatch = product.genre?.toLowerCase().includes(searchTerm)

            if (!(nameMatch || skuMatch || genreMatch)) return false
        }

        // MARCA filter
        if (filters.marca.trim()) {
            const brandMatch = product.brand?.toLowerCase().includes(filters.marca.toLowerCase())
            if (!brandMatch) return false
        }

        // CATEGORÍA filter
        if (filters.categoria.trim()) {
            const categoryName = product.Category?.name?.toLowerCase() || ""
            if (!categoryName.includes(filters.categoria.toLowerCase())) return false
        }

        return true
    })
}

// Helper function to apply variation-level filters - ACTUALIZADA para búsqueda exacta
export function applyVariationFilters(variations: any[], filters: any, adminStoreIDs: string[]) {
    return variations.filter(({ variation }) => {
        // TALLA filter
        if (filters.talla.trim()) {
            const sizeMatch = variation.sizeNumber?.toLowerCase().includes(filters.talla.toLowerCase())
            if (!sizeMatch) return false
        }

        // OFERTAS filter
        if (filters.ofertas) {
            if (!variation.offerPrice || variation.offerPrice <= 0) return false
        }

        return true
    })
}
