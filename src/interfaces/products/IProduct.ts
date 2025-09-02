//import { ICategory } from "../categories/ICategory"
import { ICategory } from "../categories/ICategory"
import { IProductVariation } from "./IProductVariation"

export type Brand = "D3SI" | "Otro"
export type Genre = "Hombre" | "Mujer" | "Unisex"

export interface IProduct {
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
