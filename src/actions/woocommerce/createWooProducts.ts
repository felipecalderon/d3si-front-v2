import { wooFetcher } from "@/lib/woocommerce-fetcher"
import { WooCreateProductPayload } from "@/utils/mappers/saleProductsToWooItems"

export const createWooParentProducts = async (payload: WooCreateProductPayload[]): Promise<any> => {
    try {
        const products = await wooFetcher<any>(`products/batch`, {
            method: "POST",
            body: JSON.stringify({ create: payload }),
        })
        return products
    } catch (error) {
        console.error(error)
        return null
    }
}
