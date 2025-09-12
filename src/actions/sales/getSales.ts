import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { ISaleResponse } from "@/interfaces/sales/ISale"

export const getSales = async (storeID: string, date: string): Promise<ISaleResponse[]> => {
    const params = new URLSearchParams({ storeID, date })
    const newUrl = `${API_URL}/sale?${params.toString()}`
    const sales = await fetcher<ISaleResponse[]>(newUrl)
    return sales.map((sale) => ({
        ...sale,
    }))
}

export const getSingleSale = async (saleID: string) => {
    return await fetcher<ISaleResponse>(`${API_URL}/sale/${saleID}`)
}
