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

const ITEMS_PER_PAGE = 10

export function useInventory(initialProducts: IProduct[], stores: IStore[]) {
    const { user } = useAuth()
    const { storeSelected } = useTienda()
    const { rawProducts, setRawProducts, columnFilters, currentPage, setCurrentPage } = inventoryStore()

    const userStoreID = storeSelected?.storeID

    const filteredInitialProducts = useMemo(() => {
        if (user?.role === Role.Admin || user?.role === Role.Tercero || !userStoreID) return initialProducts
        return initialProducts.filter((product) =>
            product.ProductVariations.some((variation) =>
                variation.StoreProducts.some((sp) => sp.storeID === userStoreID)
            )
        )
    }, [initialProducts, user?.role, userStoreID])

    useEffect(() => {
        setRawProducts(filteredInitialProducts)
    }, [filteredInitialProducts, setRawProducts])

    const adminStoreIDs = useMemo(() => stores.filter((s) => s.isAdminStore).map((s) => s.storeID), [stores])

    const filteredProducts = useMemo(() => {
        return applyColumnFilters(rawProducts, columnFilters)
    }, [rawProducts, columnFilters])

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

    const totalPages = Math.ceil(flattenedProducts.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentItems = flattenedProducts.slice(startIndex, endIndex)

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
                        const storeProduct = v.StoreProducts.find((sp) => sp.storeID === userStoreID)
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
    }
}
