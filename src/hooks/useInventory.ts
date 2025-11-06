"use client"

import { useMemo, useEffect } from "react"
import { useAuth } from "@/stores/user.store"
import { useTienda } from "@/stores/tienda.store"
import { inventoryStore } from "@/stores/inventory.store"
import { applyColumnFilters, applyVariationFilters } from "@/components/Inventory/TableSection/ColumnFilters"
import { Role } from "@/lib/userRoles"
import type { IProduct } from "@/interfaces/products/IProduct"
import type { IStore } from "@/interfaces/stores/IStore"
import type { FlattenedItem } from "@/interfaces/products/IFlatternProduct"

const ITEMS_PER_PAGE = 20

export function useInventory(initialProducts: IProduct[], stores: IStore[]) {
    const { user } = useAuth()
    const { storeSelected } = useTienda()
    const { rawProducts, setRawProducts, columnFilters, currentPage, setCurrentPage } = inventoryStore()

    const userStoreID = storeSelected?.storeID

    const filteredInitialProducts = useMemo(() => {
        if (user?.role === Role.Admin || user?.role === Role.Tercero || !userStoreID) return initialProducts
        return initialProducts.filter((product) =>
            product.ProductVariations.some((variation) =>
                variation.StoreProducts?.some((sp) => sp.storeID === userStoreID)
            )
        )
    }, [initialProducts, user?.role, userStoreID])

    useEffect(() => {
        setRawProducts(filteredInitialProducts)
    }, [filteredInitialProducts, setRawProducts])

    const adminStoreIDs = useMemo(() => stores.filter((s) => s.isAdminStore).map((s) => s.storeID), [stores])

    const result = useMemo(() => {
        return applyColumnFilters(rawProducts, columnFilters)
    }, [rawProducts, columnFilters])

    const filteredProducts = result.filteredProducts
    const totalStock = result.totalStock

    const flattenedProducts = useMemo<FlattenedItem[]>(() => {
        const flattened: FlattenedItem[] = []
        filteredProducts.forEach((product) => {
            const totalStockQuantity = product.ProductVariations.reduce(
                (total: any, v: { stockQuantity: any }) => total + v.stockQuantity,
                0
            )
            const variationCount = product.ProductVariations.length
            product.ProductVariations.forEach((variation: any, index: number) => {
                flattened.push({
                    product,
                    variation,
                    isFirst: index === 0,
                    totalStock: totalStockQuantity,
                    rowSpan: variationCount,
                })
            })
        })

        return applyVariationFilters(flattened, columnFilters, adminStoreIDs)
    }, [filteredProducts, columnFilters, adminStoreIDs])

    // Se implementa paginación que mantiene productos agrupados
    const paginatedItems = useMemo(() => {
        const pages = []
        let currentPage: FlattenedItem[] = []
        let currentVariationCount = 0

        // Se agrupan productos por ID
        const groupedProducts = flattenedProducts.reduce((groups, item) => {
            const productId = item.product.productID
            if (!groups[productId]) {
                groups[productId] = []
            }
            groups[productId].push(item)
            return groups
        }, {} as Record<string, FlattenedItem[]>)

        // Iterar sobre los grupos de productos
        for (const productGroup of Object.values(groupedProducts)) {
            const variationCount = productGroup.length

            // Si añadir este producto excedería el límite de la página actual
            if (currentVariationCount > 0 && currentVariationCount + variationCount > ITEMS_PER_PAGE) {
                pages.push(currentPage)
                currentPage = []
                currentVariationCount = 0
            }

            // Añadir todas las variaciones del producto actual
            productGroup.forEach((item, index) => {
                currentPage.push({
                    ...item,
                    isFirst: index === 0,
                })
            })
            currentVariationCount += variationCount
        }

        // Añadir la última página si tiene elementos
        if (currentPage.length > 0) {
            pages.push(currentPage)
        }

        return pages
    }, [flattenedProducts])

    const totalPages = paginatedItems.length

    const currentItems = useMemo(() => paginatedItems[currentPage - 1] || [], [paginatedItems, currentPage])

    const uniqueProductsInCurrentPage = useMemo(() => {
        const uniqueProductIds = new Set()
        currentItems.forEach(({ product }) => uniqueProductIds.add(product.productID))
        return uniqueProductIds.size
    }, [currentItems])

    const totalStockShown = useMemo(() => {
        if (user?.role === Role.Admin || user?.role === Role.Tercero) {
            return rawProducts.reduce(
                (total, product) => total + product.ProductVariations.reduce((sum, v) => sum + v.stockQuantity, 0),
                0
            )
        } else if (user?.role === Role.Vendedor && userStoreID) {
            return rawProducts.reduce((total, product) => {
                return (
                    total +
                    product.ProductVariations.reduce((sum, v) => {
                        const storeProduct = v.StoreProducts?.find((sp) => sp.storeID === userStoreID)
                        return sum + (storeProduct ? storeProduct.quantity : 0)
                    }, 0)
                )
            }, 0)
        } else {
            return 0
        }
    }, [rawProducts, user?.role, userStoreID])

    useEffect(() => {
        setCurrentPage(1)
    }, [columnFilters, setCurrentPage])

    const getVisiblePages = () => {
        const pages: (number | "...")[] = []
        const maxVisiblePages = 5
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, "...", totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
            } else {
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
            }
        }
        return pages
    }

    return {
        user,
        rawProducts,
        currentItems,
        totalPages,
        currentPage,
        uniqueProductsInCurrentPage,
        totalStockShown,
        filteredProducts,
        flattenedProducts,
        adminStoreIDs,
        getVisiblePages,
        setCurrentPage,
        filteredStockTotal: totalStock,
    }
}
