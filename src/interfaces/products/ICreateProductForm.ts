// src/interfaces/products/ICreateProductForm.ts

export interface Size {
    tempId?: string
    sizeNumber: string
    priceList: number
    priceCost: number
    sku: string
    stockQuantity: number
}

export interface CreateProductFormData {
    tempId?: string
    name: string
    image: string
    categoryID: string
    genre: "Hombre" | "Mujer" | "Unisex"
    brand: "D3SI" | "Otro"
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
