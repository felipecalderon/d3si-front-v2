"use client"

import { useState, useMemo, useCallback } from "react"
import { IProductVariation } from "@/interfaces/products/IProductVariation"

const IVA = 1.19

import { IProduct } from "@/interfaces/products/IProduct"

interface PurchaseOrderItem {
    product: IProduct
    variation: IProductVariation
    isFirst: boolean
}

export function useTerceroProducts(
    items: PurchaseOrderItem[],
    initialMarkupTerceroMin = 1.7,
    initialMarkupTerceroMax = 3.0,
    initialMarkupFlotanteMin = 1.4
) {
    const [markupTerceroMin, setMarkupTerceroMin] = useState(initialMarkupTerceroMin)
    const [markupTerceroMax, setMarkupTerceroMax] = useState(initialMarkupTerceroMax)
    const [markupFlotanteMin, setMarkupFlotanteMin] = useState(initialMarkupFlotanteMin)

    const calculateThirdPartyPrice = useCallback(
        (priceList: number, step = 0.01) => {
            for (let markupFlotante = markupTerceroMin; markupFlotante <= markupTerceroMax; markupFlotante += step) {
                const costoNetoTercero = priceList / markupFlotante
                const brutoCompra = costoNetoTercero * IVA
                const markupTercero = priceList / brutoCompra

                if (markupTercero >= markupTerceroMin && markupTercero <= markupTerceroMax) {
                    return {
                        markupFlotante,
                        costoNetoTercero,
                        brutoCompra,
                        markupTercero,
                    }
                }
            }
            return null
        },
        [markupTerceroMin, markupTerceroMax]
    )

    const filteredItems = useMemo(() => {
        const cache = new Map<number, ReturnType<typeof calculateThirdPartyPrice>>()

        return items.filter(({ variation }) => {
            const priceList = Number(variation.priceList)
            const priceCost = Number(variation.priceCost)
            if (!priceList || !priceCost) return false

            let third = cache.get(priceList)
            if (third === undefined) {
                third = calculateThirdPartyPrice(priceList)
                cache.set(priceList, third)
            }

            if (!third) return false

            const markupFlotante = third.brutoCompra / priceCost
            return markupFlotante >= markupFlotanteMin
        })
    }, [items, markupFlotanteMin, calculateThirdPartyPrice])

    return {
        filteredItems,
        markupTerceroMin,
        setMarkupTerceroMin,
        markupTerceroMax,
        setMarkupTerceroMax,
        markupFlotanteMin,
        setMarkupFlotanteMin,
        calculateThirdPartyPrice,
    }
}
