"use server"
import { WooCommerceOrder } from "@/interfaces/woocommerce/Order"
import { wooFetcher } from "@/lib/woocommerce-fetcher"

type UpdateWoo = Partial<WooCommerceOrder>
export const updateWooOrder = async (updateWoo: UpdateWoo): Promise<WooCommerceOrder | null> => {
    try {
        const order = await wooFetcher<WooCommerceOrder>(`orders/${updateWoo.id}`, {
            method: "PUT",
            body: JSON.stringify(updateWoo),
        })
        return order
    } catch (error) {
        console.error(error)
        return null
    }
}
