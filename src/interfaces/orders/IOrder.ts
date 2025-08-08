export interface IProductVariation {
    OrderProduct: any
    Product: any
    variationID: string
    productID: string
    sizeNumber: string
    priceList: string
    priceCost: number
    sku: string
    stockQuantity: number
    createdAt: string
    updatedAt: string
    quantityOrdered: number
    subtotal: number
}

export interface IOrder {
    orderID: string
    storeID: string
    userID: string
    total: string
    status: string
    type: string
    discount: string
    dte: string | null
    startQuote: string | null
    endQuote: string | null
    expiration: string | null
    expirationPeriod: string
    createdAt: string
    updatedAt: string
    ProductVariations: IProductVariation[]
}
