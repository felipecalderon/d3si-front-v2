"use client"

import { useState, useMemo } from "react"
import { IProductVariation } from "@/interfaces/products/IProductVariation"

const IVA = 1.19

interface ThirdPartyPriceResult {
    markupFlotante: number
    costoNetoTercero: number
    brutoCompra: number
    markupTercero: number
}

import { IProduct } from "@/interfaces/products/IProduct";

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

    const calculateThirdPartyPrice = (priceList: number, step = 0.01): ThirdPartyPriceResult | null => {
        for (
            let markupFlotante = markupTerceroMin * IVA;
            markupFlotante <= markupTerceroMax * IVA;
            markupFlotante += step
        ) {
            const costoNetoTercero = priceList / markupFlotante
            const brutoCompra = costoNetoTercero * IVA
            const markupTercero = priceList / brutoCompra

            if (markupTercero >= markupTerceroMin && markupTercero <= markupTerceroMax) {
                return {
                    markupFlotante: parseFloat(markupFlotante.toFixed(3)),
                    costoNetoTercero: parseFloat(costoNetoTercero.toFixed(2)),
                    brutoCompra: parseFloat(brutoCompra.toFixed(2)),
                    markupTercero: parseFloat(markupTercero.toFixed(2)),
                }
            }
        }
        return null
    }

    const filteredItems = useMemo(() => {
        return items.filter(({ variation }) => {
            const priceList = Number(variation.priceList)
            const priceCost = Number(variation.priceCost)
            const third = calculateThirdPartyPrice(priceList)

            if (!third || !priceCost) return false

            const markupFlotante = third.brutoCompra / priceCost
            const markupTercero = priceList / third.brutoCompra

            return (
                markupTercero >= markupTerceroMin &&
                markupTercero <= markupTerceroMax &&
                markupFlotante >= markupFlotanteMin
            )
        })
    }, [items, markupTerceroMin, markupTerceroMax, markupFlotanteMin])

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