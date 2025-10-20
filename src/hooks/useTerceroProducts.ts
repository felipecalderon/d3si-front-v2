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
        (variation: IProductVariation) => {
            let costoNetoTercero = variation.priceCost * markupFlotanteMin
            const calcMarkup = variation.priceList / costoNetoTercero
            if (calcMarkup > markupTerceroMax) {
                costoNetoTercero = variation.priceList / markupTerceroMax
            }
            return {
                brutoCompra: costoNetoTercero * IVA,
            }
        },
        [markupTerceroMin, markupTerceroMax]
    )

    return {
        markupTerceroMin,
        setMarkupTerceroMin,
        markupTerceroMax,
        setMarkupTerceroMax,
        markupFlotanteMin,
        setMarkupFlotanteMin,
        calculateThirdPartyPrice,
    }
}
