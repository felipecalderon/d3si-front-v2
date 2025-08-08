import OrderDetail from "@/components/Invoices/OrderDetail"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
    return <OrderDetail orderId={params.id} />
}
