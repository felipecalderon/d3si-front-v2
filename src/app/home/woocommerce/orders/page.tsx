import { getWooCommerceOrders } from "@/actions/woocommerce/getWooCommerceOrders"
import { OrdersTable } from "@/components/WooCommerce/OrdersTable"

export default async function WooCommerceOrdersPage() {
    const orders = await getWooCommerceOrders()

    return (
        <section>
            <h1>Órdenes de WooCommerce</h1>
            <OrdersTable orders={orders} />
        </section>
    )
}
