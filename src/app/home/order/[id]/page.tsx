import OrderDetail from "@/components/Invoices/OrderDetail"
import { getOrderById } from "@/actions/orders/getOrderById"
import { getAllProducts } from "@/actions/products/getAllProducts"

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const order = await getOrderById(id)
    const allProducts = await getAllProducts()
    return <OrderDetail order={order} allProducts={allProducts} />
}
