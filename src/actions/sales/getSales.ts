import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { ISaleResponse } from "@/interfaces/sales/ISale"

export const getSales = async (storeID: string): Promise<(ISaleResponse & { createdAtFormatted: string })[]> => {
    const sales = await fetcher<ISaleResponse[]>(`${API_URL}/sale?storeID=${storeID}`)

    return sales.map((sale) => ({
        ...sale,
        createdAtFormatted: new Date(sale.createdAt).toLocaleString("es-CL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }),
    }))
}

export const getSingleSale = async (saleID: string) => {
    return await fetcher<ISaleResponse>(`${API_URL}/sale/${saleID}`)
}
