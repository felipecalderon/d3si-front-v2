import { IProduct } from "../products/IProduct"
import { IProductVariation } from "../products/IProductVariation"
import { IStore } from "../stores/IStore"
import { IUser } from "../users/IUser"

// Para enviar una nueva venta desde el frontend
export type PaymentType = "Efectivo" | "Debito" | "Credito"
export type PaymentStatus = "Pagado" | "Pendiente" | "Anulado"

export interface ISaleRequest {
    storeID: string
    products: IProductSold[]
    paymentType: PaymentType
}

// Para representar un producto vendido
export interface IProductSold {
    storeProductID: string
    quantitySold: number
}

export interface ISaleProduct {
    SaleProductID: string
    storeProductID: string
    quantitySold: number
    unitPrice: number
    subtotal: number
    StoreProduct: {
        ProductVariation: IProductVariation & { Product: IProduct }
    }
}
// Para representar una venta que viene desde el backend (respuesta)
export interface ISaleResponse {
    saleID: string
    storeID: string
    total: number
    status: PaymentStatus
    createdAt: string
    paymentType?: string
    Store: IStore
    SaleProducts: ISaleProduct[]
    Return: ISaleReturn | null
}

export interface ISaleReturn {
    returnID: string
    saleID: string
    clientEmail: string
    reason: string
    type: "DEVOLUCION" | "GARANTIA"
    returnedQuantity: 1
    processedBy: string
    additionalNotes: string
    createdAt: string
    updatedAt: string
    User: IUser
}
