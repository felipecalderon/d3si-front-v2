import { WooCommerceOrder } from "@/interfaces/woocommerce/Order"
import { ISaleResponse, ISaleProduct, PaymentStatus } from "@/interfaces/sales/ISale"
import { mapLineItemsToSaleProducts } from "./itemsWooToSaleProducts"
import { mapOrderToSaleBasic } from "./orderWooToSale"

export const mapWooOrderToSale = (order: WooCommerceOrder): ISaleResponse => {
    const sale = mapOrderToSaleBasic(order)
    const products = mapLineItemsToSaleProducts(order.line_items)

    return {
        ...sale,
        SaleProducts: products,
    }
}
