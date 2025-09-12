"use server"

import { WooCommerceOrder } from "@/interfaces/woocommerce/Order"
import { wooFetcher } from "@/lib/woocommerce-fetcher"

export const getWooCommerceOrders = async (date: Date): Promise<WooCommerceOrder[]> => {
    try {
        // obtener día 1
        const after = new Date(date.getFullYear(), date.getMonth(), 1)
        after.setHours(0, 0, 0, 0)
        date.setHours(23, 59, 59, 999)
        const params = new URLSearchParams({ before: date.toISOString(), after: after.toISOString() })
        const orders = await wooFetcher<WooCommerceOrder[]>(`orders?${params.toString()}`)
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
