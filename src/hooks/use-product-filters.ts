"use client"

import { useState, useMemo } from "react"
import type { IProduct } from "@/interfaces/products/IProduct"
import type { FilterType, SortDirection } from "@/components/ListTable/ListFilters"

export function useProductFilters(products: IProduct[]) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("genre")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>()

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products]

    if (selectedGenre) {
      filtered = filtered.filter((product) => product && product.genre === selectedGenre)
    }

    // Aplicar ordenamiento con validaciones
    return filtered.sort((a, b) => {
      let comparison = 0

      switch (selectedFilter) {
        case "genre":
          const genreA = (a && a.genre) || ""
          const genreB = (b && b.genre) || ""
          comparison = genreA.localeCompare(genreB)
          break

        case "cost":
          // Usar el precio promedio de todas las variaciones con validaciones
          const avgCostA =
            a && a.ProductVariations && Array.isArray(a.ProductVariations) && a.ProductVariations.length > 0
              ? a.ProductVariations.reduce((sum, v) => sum + (v && v.priceCost ? v.priceCost : 0), 0) /
                a.ProductVariations.length
              : 0
          const avgCostB =
            b && b.ProductVariations && Array.isArray(b.ProductVariations) && b.ProductVariations.length > 0
              ? b.ProductVariations.reduce((sum, v) => sum + (v && v.priceCost ? v.priceCost : 0), 0) /
                b.ProductVariations.length
              : 0
          comparison = avgCostA - avgCostB
          break

        case "quantity":
          // Usar la cantidad total de stock con validaciones
          const totalStockA =
            a && a.ProductVariations && Array.isArray(a.ProductVariations) && a.ProductVariations.length > 0
              ? a.ProductVariations.reduce((sum, v) => sum + (v && v.stockQuantity ? v.stockQuantity : 0), 0)
              : 0
          const totalStockB =
            b && b.ProductVariations && Array.isArray(b.ProductVariations) && b.ProductVariations.length > 0
              ? b.ProductVariations.reduce((sum, v) => sum + (v && v.stockQuantity ? v.stockQuantity : 0), 0)
              : 0
          comparison = totalStockA - totalStockB
          break

        case "created":
          // Ordenar por fecha de creación
          const createdA = a && a.createdAt ? new Date(a.createdAt).getTime() : 0
          const createdB = b && b.createdAt ? new Date(b.createdAt).getTime() : 0
          comparison = createdA - createdB
          break

        case "updated":
          // Ordenar por fecha de actualización
          const updatedA = a && a.updatedAt ? new Date(a.updatedAt).getTime() : 0
          const updatedB = b && b.updatedAt ? new Date(b.updatedAt).getTime() : 0
          comparison = updatedA - updatedB
          break

        default:
          comparison = 0
      }

      return sortDirection === "asc" ? comparison : -comparison
    })
  }, [products, selectedFilter, sortDirection,  selectedGenre])

  const clearFilters = () => {
    setSelectedGenre(undefined)
  }

  return {
    selectedFilter,
    sortDirection,
    selectedGenre,
    filteredAndSortedProducts,
    setSelectedFilter,
    setSortDirection,
    setSelectedGenre,
    clearFilters,
  }
}
