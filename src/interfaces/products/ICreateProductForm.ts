export interface Size {
    sizeNumber: string | null
    priceList: number
    priceCost: number
    sku: string
    stockQuantity: number
}

export interface CreateProductFormData {
    name: string
    image: string
    sizes: Size[]
}
