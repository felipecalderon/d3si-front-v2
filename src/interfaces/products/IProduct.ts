//import { ICategory } from "../categories/ICategory"
import { ICategory } from "../categories/ICategory"
import { IProductVariation } from "./IProductVariation"

export interface IProduct {
    genre: "Hombre" | "Mujer" | "Unisex"
    brand: "D3SI" | "Otro"
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
