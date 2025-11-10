import { IProduct } from "../products/IProduct"
import { IProductVariation, IVariationFromOrder } from "../products/IProductVariation"
import { IStore } from "../stores/IStore"

export interface IVariationWithQuantity extends IProductVariation {
    quantity: number
}
/**
 * Represente una variación de producto dentro de una orden, incluyendo la cantidad ordenada.
 */
export interface IVariationWithOrderedQuantity extends IProductVariation {
    quantityOrdered: number
}

export interface IOrder {
    orderID: string
    storeID: string
    userID: string
    total: number
    status: string
    type: string
    discount: number
    dte: string | null
    startQuote: string | null
    endQuote: string | null
    expiration: string | null
    expirationPeriod: string
    createdAt: string
    updatedAt: string
    ProductVariations: IVariationWithOrderedQuantity[]
    newProducts?: IVariationWithQuantity[]
}

export interface ISingleOrderResponse extends Omit<IOrder, "ProductVariations"> {
    ProductVariations: IVariationFromOrder[]
    Store: IStore
}

export interface PurchaseOrderItem {
    product: IProduct
    variation: IVariationWithQuantity
    isFirst: boolean
}
