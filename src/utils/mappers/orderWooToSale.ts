import { ISaleResponse, PaymentStatus } from "@/interfaces/sales/ISale"
import { IStore } from "@/interfaces/stores/IStore"
import { WooCommerceOrder } from "@/interfaces/woocommerce/Order"
import { mapWooStatusToPaymentStatus } from "./orderStatusWoo"
import { mapWooLineItemToISaleProduct } from "./mapWooLineItemToIProduct"

export const mapOrderToSaleBasic = (order: WooCommerceOrder): ISaleResponse => {
    const status: PaymentStatus = mapWooStatusToPaymentStatus(order.status)

    const store: IStore = {
        storeID: "web",
        name: "Web",
        storeImg: null,
        location: order.billing.first_name, // no hay shipping, usamos billing
        rut: "",
        phone: order.billing.phone,
        address: order.billing.first_name, // simplificado
        city: "", // no hay ciudad
        markup: "0",
        isAdminStore: false,
        role: "web",
        email: order.billing.email,
        createdAt: order.date_created,
        updatedAt: order.date_created, // no hay date_modified
        StoreProduct: {} as any,
        Users: [],
    }

    const saleProducts = order.line_items.map((item) => mapWooLineItemToISaleProduct(item, order.date_created))
    return {
        saleID: String(order.id),
        storeID: store.storeID,
        total: Number(order.total),
        status,
        createdAt: order.date_created,
        paymentType: order.payment_method_title || "N/A",
        Store: store,
        Return: null,
        SaleProducts: saleProducts,
    }
}
