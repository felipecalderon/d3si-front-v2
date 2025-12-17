import ProductVerificationPage from "@/components/Invoices/ProductVerificationPage"
import { getOrderById } from "@/actions/orders/getOrderById"
import { getAllProducts } from "@/actions/products/getAllProducts"

export default async function VerifyOrderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const [order, allProducts] = await Promise.all([getOrderById(id), getAllProducts()])

    return <ProductVerificationPage order={order} allProducts={allProducts} />
}
