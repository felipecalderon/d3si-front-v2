import { IStore } from "../stores/IStore"

export interface IStoreProduct {
    storeProductID: string
    variationID: string
    storeID: string
    quantity: number
    priceCostStore: string
    createdAt: string
    updatedAt: string
}

export interface IProductVariation {
    createdAt: string
    updatedAt: string
    variationID: string
    productID: string
    sizeNumber: string
    priceList: number
    priceCost: number
    sku: string
    stockQuantity: number
    Stores: IStore[]
    StoreProducts: IStoreProduct[]
}
