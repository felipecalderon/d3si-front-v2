import { ISendSaleReturn } from "@/interfaces/sales/ISale"
import { API_URL } from "@/lib/enviroments"

export interface AnularSale {
    saleID: string
    nullNote: ISendSaleReturn
}

export const anularSale = async (details: AnularSale) => {
    // La función fetcher ya maneja la serialización y los errores, devolviendo la promesa
    return fetch(`${API_URL}/sale`, {
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify(details),
    })
}
