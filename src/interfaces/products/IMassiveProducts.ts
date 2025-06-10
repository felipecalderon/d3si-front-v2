export interface CreateMassiveProductPayload {
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

export interface ErrorState {
    name?: string
    image?: string
    sizes: Array<{
        sizeNumber?: string
        priceList?: string
        priceCost?: string
        sku?: string
        stockQuantity?: string
    }>
}
