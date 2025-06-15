export interface ISaleRequest {
    storeID: string
    products: {
        storeProductID: string
        quantitySold: number
    }[]
    tipoPago: "EFECTIVO" | "DÉBITO" | "CRÉDITO" | "ANULADO" | "NOTA_CREDITO" | "NOTA_DEBITO"
}
