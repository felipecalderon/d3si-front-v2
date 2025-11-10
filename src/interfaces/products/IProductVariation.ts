import { IStore } from "../stores/IStore"
import { IProduct } from "./IProduct"

export interface IStoreProduct {
    storeProductID: string
    variationID: string
    storeID: string
    quantity: number
    priceCostStore: string
    createdAt: string
    updatedAt: string
    Store: IStore
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
    Stores?: IStore[]
    StoreProducts?: IStoreProduct[]
}

export interface IVariationFromOrder extends IProductVariation {
    OrderProduct: {
        OrderProductID: string
        orderID: string
        variationID: string
        quantityOrdered: number
        priceCost: number
        subtotal: number
        createdAt: string
        updatedAt: string
    }
    Product: IProduct
}
