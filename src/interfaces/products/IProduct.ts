import { ICategory } from "../categories/ICategory"
import { IProductVariation } from "./IProductVariation"

export type Brand = "D3SI" | "Otro"
export type Genre = "Hombre" | "Mujer" | "Unisex"

// Se añadieron description, sku y wooID, revisar con felipe si es correcto y no interfiere ahora con el sistema
// SKU se añadió en IProduct para los productos simples, pero se debe agregar desde el único productVariation
// Description si hace falta, se agregará la propiedad a la base de datos

export interface IProduct {
    // sku: undefined
    description: string
    wooID: number | null
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
