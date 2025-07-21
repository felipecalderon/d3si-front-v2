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
