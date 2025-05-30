export type ProductAPI = {
    productID: string
    name: string
    image: string
    totalProducts: number
    ProductVariations: VariationAPI[]
}

export type VariationAPI = {
    variationID: string
    productID: string
    sizeNumber: string
    priceList: string
    priceCost: string
    sku: string
    stockQuantity: number
    StoreProducts: {
        quantity: number
    }[]
}

export type FlattenedProduct = {
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

export type CreateMassiveProductPayload = {
    products: Array<{
        name: string
        image: string
        sizes: Array<{
            sizeNumber: string | null
            priceList: number
            priceCost: number
            sku: string
            stockQuantity: number
        }>
    }>
}
