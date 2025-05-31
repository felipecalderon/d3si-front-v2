import { IStore } from "./IStore"

export interface IProductVariation {
    variationID: string
    productID: string
    sizeNumber: string
    priceList: string
    priceCost: string
    sku: string
    stockQuantity: number
    Stores: IStore[]
}