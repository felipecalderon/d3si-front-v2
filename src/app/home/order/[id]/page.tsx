import OrderDetail from "@/components/Invoices/OrderDetail"

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return <OrderDetail orderId={id} />
}
