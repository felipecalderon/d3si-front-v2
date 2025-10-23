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
    initialMarkupTerceroMin = 1.6,
    initialMarkupTerceroMax = 3.0,
    initialMarkupFlotanteMin = 1.5
) {
    const [markupTerceroMin, setMarkupTerceroMin] = useState(initialMarkupTerceroMin)
    const [markupTerceroMax, setMarkupTerceroMax] = useState(initialMarkupTerceroMax)
    const [markupFlotanteMin, setMarkupFlotanteMin] = useState(initialMarkupFlotanteMin)

    const calculateThirdPartyPrice = useCallback(
        (variation: IProductVariation) => {
            let costoBrutoTercero = variation.priceCost * markupFlotanteMin
            const calcMarkup = variation.priceList / costoBrutoTercero
            if (calcMarkup > markupTerceroMax) {
                costoBrutoTercero = variation.priceList / markupTerceroMax
            }
            return {
                brutoCompra: costoBrutoTercero,
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
