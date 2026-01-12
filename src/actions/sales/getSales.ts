import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { ISaleResponse } from "@/interfaces/sales/ISale"

export const getSales = async (storeID: string, date: string): Promise<ISaleResponse[]> => {
    const params = new URLSearchParams({ storeID, date })
    const newUrl = `${API_URL}/sale?${params.toString()}`
    const sales = await fetcher<ISaleResponse[]>(newUrl)

    // Si hay ventas anuladas, traemos el detalle para obtener la información del Return
    // que usualmente no viene en el listado general
    const salesWithDetails = await Promise.all(
        sales.map(async (sale) => {
            if (sale.status === "Anulado" && !sale.Return) {
                try {
                    return await getSingleSale(sale.saleID)
                } catch (error) {
                    console.error(`Error fetching details for sale ${sale.saleID}:`, error)
                    return sale
                }
            }
            return sale
        })
    )

    return salesWithDetails
}

export const getSingleSale = async (saleID: string) => {
    return await fetcher<ISaleResponse>(`${API_URL}/sale/${saleID}`)
}
