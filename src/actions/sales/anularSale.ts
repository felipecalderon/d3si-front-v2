import { ISendSaleReturn } from "@/interfaces/sales/ISale"
import { API_URL } from "@/lib/enviroments"

export interface AnularSale {
    saleID: string
    nullNote: ISendSaleReturn
    // Opcional: información del producto específico a devolver/anular
    productToReturn?: {
        storeProductID: string
        quantity: number
    }
}

export const anularSale = async (details: AnularSale) => {
    // La función fetcher ya maneja la serialización y los errores, devolviendo la promesa
    console.log({ API_URL })
    return fetch(`${API_URL}/sale`, {
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify(details),
    })
}
