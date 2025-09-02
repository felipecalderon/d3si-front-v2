import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"

export interface AnularSale {
    saleID: string
    nullNote: {
        clientEmail: string
        reason: string
        type: "DEVOLUCION" | "GARANTIA" | "ANULACION"
        returnedQuantity: number
        processedBy: string
        additionalNotes: string
    }
}
export const anularSale = async (details: AnularSale) => {
    // La función fetcher ya maneja la serialización y los errores, devolviendo la promesa
    return fetch(`${API_URL}/sale`, {
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify(details),
    })
}
