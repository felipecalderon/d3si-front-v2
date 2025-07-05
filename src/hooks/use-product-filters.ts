"use client"

import { useState, useMemo } from "react"
import type { IProduct } from "@/interfaces/products/IProduct"
import type { FilterType, SortDirection } from "@/components/ListTable/ListFilters"

export function useProductFilters(products: IProduct[]) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("category")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>()

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products]

    // Aplicar filtros específicos con validaciones
    if (selectedCategory) {
      // Filtrar por categoría usando el array categoryID con validaciones exhaustivas
      filtered = filtered.filter((product) => {
        // Validaciones de seguridad
        if (!product || !product.categoryID) {
          return false
        }

        // Verificar que categoryID es un array válido
        if (!Array.isArray(product.categoryID) || product.categoryID.length === 0) {
          return false
        }

        // Verificar que al menos una categoría coincide
        return product.categoryID.some((cat) => {
          return cat && cat.name && cat.name === selectedCategory
        })
      })
    }

    if (selectedGenre) {
      filtered = filtered.filter((product) => product && product.genre === selectedGenre)
    }

    // Aplicar ordenamiento con validaciones
    return filtered.sort((a, b) => {
      let comparison = 0

      switch (selectedFilter) {
        case "category":
          // Usar el primer nombre de categoría para ordenar, con validaciones
          const categoryA =
            a &&
            a.categoryID &&
            Array.isArray(a.categoryID) &&
            a.categoryID.length > 0 &&
            a.categoryID[0] &&
            a.categoryID[0].name
              ? a.categoryID[0].name
              : ""
          const categoryB =
            b &&
            b.categoryID &&
            Array.isArray(b.categoryID) &&
            b.categoryID.length > 0 &&
            b.categoryID[0] &&
            b.categoryID[0].name
              ? b.categoryID[0].name
              : ""
          comparison = categoryA.localeCompare(categoryB)
          break

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
  }, [products, selectedFilter, sortDirection, selectedCategory, selectedGenre])

  const clearFilters = () => {
    setSelectedCategory(undefined)
    setSelectedGenre(undefined)
  }

  return {
    selectedFilter,
    sortDirection,
    selectedCategory,
    selectedGenre,
    filteredAndSortedProducts,
    setSelectedFilter,
    setSortDirection,
    setSelectedCategory,
    setSelectedGenre,
    clearFilters,
  }
}
