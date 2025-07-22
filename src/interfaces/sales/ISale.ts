// Para enviar una nueva venta desde el frontend
export interface ISaleRequest {
    storeID: string
    products: IProductSold[]
    paymentType: "Efectivo" | "Débito" | "Crédito"
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
    status: string
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
