import { getWooCommerceOrders } from "@/actions/woocommerce/getWooCommerceOrders"
import { OrdersTable } from "@/components/WooCommerce/OrdersTable"

const WooCommerceOrdersPage = async () => {
    const orders = await getWooCommerceOrders()

    return (
        <section>
            <h1>Órdenes de WooCommerce</h1>
            <OrdersTable orders={orders} />
        </section>
    )
}

export default WooCommerceOrdersPage
