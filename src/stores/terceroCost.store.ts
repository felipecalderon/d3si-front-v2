import { create } from "zustand"
import { IProductVariation, IVariationFromOrder } from "@/interfaces/products/IProductVariation"

interface TerceroProductsState {
    markupTerceroMin: number
    markupTerceroMax: number
    markupFlotanteMin: number

    setMarkupTerceroMin: (value: number) => void
    setMarkupTerceroMax: (value: number) => void
    setMarkupFlotanteMin: (value: number) => void

    calculateThirdPartyPrice: (variation: IProductVariation | IVariationFromOrder) => { brutoCompra: number }
}

export const useTerceroProducts = create<TerceroProductsState>((set, get) => ({
    markupTerceroMin: 1.6,
    markupTerceroMax: 3.0,
    markupFlotanteMin: 1.5,

    setMarkupTerceroMin: (value) => set({ markupTerceroMin: value }),
    setMarkupTerceroMax: (value) => set({ markupTerceroMax: value }),
    setMarkupFlotanteMin: (value) => set({ markupFlotanteMin: value }),

    calculateThirdPartyPrice: (variation) => {
        const { markupTerceroMax, markupFlotanteMin } = get()

        let costoBrutoTercero = variation.priceCost * markupFlotanteMin
        const calcMarkup = variation.priceList / costoBrutoTercero

        if (calcMarkup > markupTerceroMax) {
            costoBrutoTercero = variation.priceList / markupTerceroMax
        }

        return {
            brutoCompra: costoBrutoTercero,
        }
    },
}))
