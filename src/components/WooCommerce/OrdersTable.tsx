"use client"

import { WooCommerceOrder } from "@/interfaces/woocommerce/Order"

interface Props {
    orders: WooCommerceOrder[]
}

export const OrdersTable = ({ orders }: Props) => {
    if (orders.length === 0) {
        return <p>No se encontraron órdenes.</p>
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((order) => (
                    <tr key={order.id}>
                        <td>{order.number}</td>
                        <td>{order.billing.first_name} {order.billing.last_name}</td>
                        <td>{new Date(order.date_created).toLocaleDateString()}</td>
                        <td>{order.status}</td>
                        <td>{order.total}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
