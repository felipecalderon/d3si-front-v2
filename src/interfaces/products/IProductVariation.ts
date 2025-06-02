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
    variationID: string
    productID: string
    sizeNumber: string
    priceList: string
    priceCost: string
    sku: string
    stockQuantity: number
    Stores: IStore[]
    StoreProducts: IStoreProduct[]
}
