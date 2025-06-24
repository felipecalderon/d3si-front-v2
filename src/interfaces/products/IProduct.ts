import { IProductVariation } from "./IProductVariation"

export interface IProduct {
    genre: string
    productID: string
    name: string
    image: string
    totalProducts: number
    createdAt: string
    updatedAt: string
    ProductVariations: IProductVariation[]
}
