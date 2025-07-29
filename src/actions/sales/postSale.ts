import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { ISaleRequest } from "@/interfaces/sales/ISale"

export const postSale = async (saleData: ISaleRequest) => {
    try {
        const data = await fetcher(`${API_URL}/sale`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(saleData),
        })
        return data
    } catch (error) {
        console.error("Error saving the sale", error)
        return null
    }
}
