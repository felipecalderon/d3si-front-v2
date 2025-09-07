"use server"

import { WooCommerceOrder } from "@/interfaces/woocommerce/Order"
import { wooFetcher } from "@/lib/woocommerce-fetcher"

export const getWooCommerceOrders = async (): Promise<WooCommerceOrder[]> => {
    try {
        const orders = await wooFetcher<WooCommerceOrder[]>("orders")
        return orders
    } catch (error) {
        console.error(error)
        return []
    }
}

export const getWooSingleOrder = async (saleID: string): Promise<WooCommerceOrder | null> => {
    try {
        const order = await wooFetcher<WooCommerceOrder>(`orders/${saleID}`)
        return order
    } catch (error) {
        console.error(error)
        return null
    }
}
