import { IProduct } from "./IProduct"

export interface FlattenedProduct {
    id: string
    name: string
    image: string
    sku: string
    size: string
    priceCost: number
    priceList: number
    centralStock: number
    totalStock: number
    totalProducts: number // <-- agrega aquí
}

export interface FlattenedItem {
    product: IProduct
    variation: IProduct["ProductVariations"][number]
    isFirst: boolean
    totalStock: number
    rowSpan: number
}
