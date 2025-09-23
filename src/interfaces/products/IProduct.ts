import { ICategory } from "../categories/ICategory"
import { IProductVariation } from "./IProductVariation"

export type Brand = "D3SI" | "Otro"
export type Genre = "Hombre" | "Mujer" | "Unisex"

//Se añadieron description, sku y wooID, revisar con felipe si es correcto y no interfiere ahora con el sistema

export interface IProduct {
    description: string
    sku: undefined
    wooID: any
    brand: Brand
    genre: Genre
    productID: string
    name: string
    image: string
    totalProducts: number
    createdAt: string
    updatedAt: string
    ProductVariations: IProductVariation[]
    categoryID: string | null
    stock: number
    Category?: ICategory
}
