// Para enviar una nueva venta desde el frontend
export type PaymentType = "Efectivo" | "Débito" | "Crédito"
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

// Para representar una venta que viene desde el backend (respuesta)
export interface ISaleResponse {
    saleID: string
    total: number
    status: PaymentStatus
    createdAt: string
    paymentType?: string
    Store?: {
        name: string
    }
    SaleProducts?: {
        quantitySold: number
        unitPrice: number
        StoreProduct?: {
            ProductVariation?: {
                Product?: {
                    name: string
                }
            }
        }
    }[]
}
