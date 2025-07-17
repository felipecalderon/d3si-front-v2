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
    categoryID: string
    genre: string
    brand: string
    sizes: Size[]
}

export interface MassiveCreateProductData {
    products: CreateProductFormData[]
}

export interface ErrorState {
    category: string
    name?: string
    image?: string
    genre?: string
    sizes: Record<string, string>[]
}
