// src/interfaces/products/ICreateProductForm.ts

export interface Size {
    sizeNumber: string
    priceList: number
    priceCost: number
    sku: string
    stockQuantity: number
}

export interface CreateProductFormData {
    name: string
    image: string
    genre: string
    sizes: Size[]
}

export interface MassiveCreateProductData {
    products: CreateProductFormData[]
}

export interface ErrorState {
    name?: string
    image?: string
    genre?: string
    sizes: Record<string, string>[]
}
