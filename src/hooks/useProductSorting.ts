"use client"

import { useState, useMemo } from "react"
import { IProduct } from "@/interfaces/products/IProduct"
import { IProductVariation } from "@/interfaces/products/IProductVariation"

interface PurchaseOrderItem {
    product: IProduct
    variation: IProductVariation
    isFirst: boolean
}

const calculateMarkup = (priceCost: number, priceList: number): number => {
    if (!priceCost) return 0
    return priceList / priceCost
}

export function useProductSorting(items: PurchaseOrderItem[], isTercero: boolean) {
    const [orderByMarkup, setOrderByMarkup] = useState(false)

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            // Marca primero
            if (a.product.brand === "D3SI" && b.product.brand !== "D3SI") return -1
            if (a.product.brand !== "D3SI" && b.product.brand === "D3SI") return 1

            if (isTercero && orderByMarkup) {
                // Ordenar por markup de mayor a menor solo para tercero
                const markupA = calculateMarkup(Number(a.variation.priceCost), Number(a.variation.priceList))
                const markupB = calculateMarkup(Number(b.variation.priceCost), Number(b.variation.priceList))
                return markupB - markupA
            } else {
                // Ordenar por stock de mayor a menor
                const stockA = a.variation.stockQuantity ?? 0
                const stockB = b.variation.stockQuantity ?? 0
                return stockB - stockA
            }
        })
    }, [items, isTercero, orderByMarkup])

    return {
        sortedItems,
        orderByMarkup,
        setOrderByMarkup,
    }
}
