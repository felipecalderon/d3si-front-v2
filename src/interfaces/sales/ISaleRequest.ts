import { IProductSold, PaymentType } from "./ISale"

export interface ISaleRequest {
    storeID: string
    products: IProductSold[]
    tipoPago: PaymentType
}
