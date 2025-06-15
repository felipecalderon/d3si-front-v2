import { IProductoEnVenta } from "../products/IProductoEnVenta"

export interface ISale {
    storeID: string
    products: IProductoEnVenta[]
    tipoPago: string
}

export interface IProductSold {
    storeProductID: string
    quantitySold: number
}
