"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Filter, X, TrendingUp, TrendingDown, Users, Tag, DollarSign, Package, Calendar, Clock } from "lucide-react"
import type { IProduct } from "@/interfaces/products/IProduct"
import type { ICategory } from "@/interfaces/categories/ICategory"
import { useMemo } from "react"

export type FilterType = "category" | "genre" | "cost" | "quantity" | "created" | "updated"
export type SortDirection = "asc" | "desc"

interface ProductFiltersProps {
    products: IProduct[]
    categories: ICategory[]
    selectedFilter: FilterType
    sortDirection: SortDirection
    selectedCategory?: string
    selectedGenre?: string
    onFilterChange: (filter: FilterType) => void
    onSortDirectionChange: (direction: SortDirection) => void
    onCategoryChange: (category: string | undefined) => void
    onGenreChange: (genre: string | undefined) => void
    onClearFilters: () => void
}

export function ListFilters({
    products,
    categories,
    selectedFilter,
    sortDirection,
    selectedCategory,
    selectedGenre,
    onFilterChange,
    onSortDirectionChange,
    onCategoryChange,
    onGenreChange,
    onClearFilters,
}: ProductFiltersProps) {
    // Obtener categorías con contador de productos
    const categoriesWithCount = useMemo(() => {
        // Validar que tenemos datos válidos
        if (!Array.isArray(categories) || !Array.isArray(products)) {
            return []
        }

        return categories
            .map((category) => {
                // Validar que la categoría tiene nombre
                if (!category || !category.name) {
                    return null
                }

                const productCount = products.filter((product) => {
                    // Validaciones exhaustivas para evitar errores de null/undefined
                    if (!product || !product.categoryID) {
                        return false
                    }

                    // Verificar que categoryID es un array válido
                    if (!Array.isArray(product.categoryID) || product.categoryID.length === 0) {
                        return false
                    }

                    // Verificar que al menos una categoría coincide
                    return product.categoryID.some((cat) => {
                        return cat && cat.name && cat.name === category.name
                    })
                }).length

                return {
                    ...category,
                    productCount,
                }
            })
            .filter((cat) => cat !== null && cat.productCount > 0) // Solo mostrar categorías válidas que tienen productos
            .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
    }, [products, categories])

    // Función helper para obtener el nombre de la categoría
    const getCategoryName = (categoryName: string) => {
        const category = categoriesWithCount.find((cat) => cat?.name === categoryName)
        return category ? category.name : categoryName
    }

    // Obtener géneros únicos
    const genres = Array.from(new Set(products.map((p) => p.genre).filter(Boolean)))

    const getFilterIcon = (filter: FilterType) => {
        switch (filter) {
            case "category":
                return <Tag className="w-4 h-4" />
            case "genre":
                return <Users className="w-4 h-4" />
            case "cost":
                return <DollarSign className="w-4 h-4" />
            case "quantity":
                return <Package className="w-4 h-4" />
            case "created":
                return <Calendar className="w-4 h-4" />
            case "updated":
                return <Clock className="w-4 h-4" />
        }
    }

    const getFilterLabel = (filter: FilterType) => {
        const labels = {
            category: "Por Categoría",
            genre: "Por Género",
            cost: "Por Costo",
            quantity: "Por Cantidad",
            created: "Por Fecha Creación",
            updated: "Por Fecha Actualización",
        }
        return labels[filter]
    }

    const getSortLabel = () => {
        const baseLabels = {
            category: "Categoría",
            genre: "Género",
            cost: "Costo",
            quantity: "Cantidad",
            created: "Fecha Creación",
            updated: "Fecha Actualización",
        }

        const direction = sortDirection === "asc" ? "Más Antiguos Primero" : "Más Recientes Primero"

        // Para fechas, cambiar la descripción
        if (selectedFilter === "created" || selectedFilter === "updated") {
            return `${baseLabels[selectedFilter]} - ${direction}`
        }

        // Para otros filtros, usar la descripción original
        const originalDirection = sortDirection === "asc" ? "Menor a Mayor" : "Mayor a Menor"
        return `${baseLabels[selectedFilter]} - ${originalDirection}`
    }

    const hasActiveFilters = selectedCategory || selectedGenre

    return (
        <div className="flex flex-col gap-4">
            {/* Filtros principales */}
            <div className="flex lg:flex-row flex-col items-center gap-4">
                {/* Selector de tipo de filtro */}
                <Select value={selectedFilter} onValueChange={(value: FilterType) => onFilterChange(value)}>
                    <SelectTrigger className="w-[220px] h-11 border-2">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            <SelectValue />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="category">
                            <div className="flex items-center gap-2">
                                <Tag className="w-4 h-4" />
                                Por Categoría
                            </div>
                        </SelectItem>
                        <SelectItem value="genre">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Por Género
                            </div>
                        </SelectItem>
                        <SelectItem value="cost">
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                Por Costo
                            </div>
                        </SelectItem>
                        <SelectItem value="quantity">
                            <div className="flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                Por Cantidad
                            </div>
                        </SelectItem>
                        <SelectItem value="created">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Por Fecha Creación
                            </div>
                        </SelectItem>
                        <SelectItem value="updated">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Por Fecha Actualización
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>

                {/* Selector de dirección de ordenamiento */}
                <Select value={sortDirection} onValueChange={(value: SortDirection) => onSortDirectionChange(value)}>
                    <SelectTrigger className="w-[200px] h-11 border-2">
                        <div className="flex items-center gap-2">
                            {sortDirection === "asc" ? (
                                <TrendingUp className="w-4 h-4" />
                            ) : (
                                <TrendingDown className="w-4 h-4" />
                            )}
                            <SelectValue />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        {selectedFilter === "created" || selectedFilter === "updated" ? (
                            <>
                                <SelectItem value="asc">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" />
                                        Más Antiguos Primero
                                    </div>
                                </SelectItem>
                                <SelectItem value="desc">
                                    <div className="flex items-center gap-2">
                                        <TrendingDown className="w-4 h-4" />
                                        Más Recientes Primero
                                    </div>
                                </SelectItem>
                            </>
                        ) : (
                            <>
                                <SelectItem value="asc">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" />
                                        Menor a Mayor
                                    </div>
                                </SelectItem>
                                <SelectItem value="desc">
                                    <div className="flex items-center gap-2">
                                        <TrendingDown className="w-4 h-4" />
                                        Mayor a Menor
                                    </div>
                                </SelectItem>
                            </>
                        )}
                    </SelectContent>
                </Select>

                {/* Filtro de categorías - siempre visible cuando está seleccionado */}
                {selectedFilter === "category" && categories.length > 0 && (
                    <Select
                        value={selectedCategory || "all"}
                        onValueChange={(value) => onCategoryChange(value === "all" ? undefined : value)}
                    >
                        <SelectTrigger className="w-[200px] h-11 border-2">
                            <SelectValue placeholder="Todas las categorías" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las categorías</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category.categoryID} value={category.name}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {selectedFilter === "genre" && genres.length > 0 && (
                    <Select
                        value={selectedGenre || "all"}
                        onValueChange={(value) => onGenreChange(value === "all" ? undefined : value)}
                    >
                        <SelectTrigger className="w-[200px] h-11 border-2">
                            <SelectValue placeholder="Todos los géneros" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los géneros</SelectItem>
                            {genres.map((genre) => (
                                <SelectItem key={genre} value={genre}>
                                    {genre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {/* Botón limpiar filtros */}
                {hasActiveFilters && (
                    <Button variant="outline" onClick={onClearFilters} className="h-11 bg-transparent">
                        <X className="w-4 h-4 mr-2" />
                        Limpiar
                    </Button>
                )}
            </div>

            {/* Badges informativos */}
            <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-sm px-3 py-1">
                    <div className="flex items-center gap-1">
                        {getFilterIcon(selectedFilter)}
                        {getSortLabel()}
                    </div>
                </Badge>

                {selectedCategory && selectedCategory !== "all" && (
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                        Categoría: {getCategoryName(selectedCategory)}
                    </Badge>
                )}

                {selectedGenre && selectedGenre !== "all" && (
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                        Género: {selectedGenre}
                    </Badge>
                )}
            </div>
        </div>
    )
}
