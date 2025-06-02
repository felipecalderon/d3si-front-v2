import { IProductVariation } from "./IProductVariation"

export interface IProduct {
    productID: string
    name: string
    image: string
    totalProducts: number
    createdAt: string
    updatedAt: string
    ProductVariations: IProductVariation[]
}
