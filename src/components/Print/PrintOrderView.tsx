"use client"

import { IOrderWithStore } from "@/interfaces/orders/IOrderWithStore"
import { toPrice } from "@/utils/priceFormat"

interface Props {
    order: IOrderWithStore
}

export default function PrintOrderView({ order }: Props) {
    const fecha = new Date(order.createdAt).toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })

    return (
        <div className="print:block hidden p-6 text-black">
            <h1 className="text-2xl font-bold mb-2">Orden de Compra</h1>
            <p>
                <strong>Folio:</strong> {order.orderID}
            </p>
            <p>
                <strong>Fecha:</strong> {fecha}
            </p>
            <p>
                <strong>Estado:</strong> {order.status}
            </p>
            <p>
                <strong>Total:</strong> ${toPrice(order.total)}
            </p>
            <p>
                <strong>Tipo:</strong> {order.type}
            </p>
            <p>
                <strong>Descuento:</strong> ${toPrice(order.discount)}
            </p>

            <hr className="my-2 border-black" />

            <h2 className="text-lg font-semibold mt-4">Tienda:</h2>
            <p>
                <strong>Nombre:</strong> {order.Store?.name}
            </p>
            <p>
                <strong>Dirección:</strong> {order.Store?.address}
            </p>
            <p>
                <strong>Teléfono:</strong> {order.Store?.phone}
            </p>

            <hr className="my-2 border-black" />

            <h2 className="text-lg font-semibold mt-4">Productos:</h2>
            <table className="w-full text-sm border-collapse border border-black">
                <thead>
                    <tr>
                        <th className="border border-black px-2 py-1">SKU</th>
                        <th className="border border-black px-2 py-1">Talla</th>
                        <th className="border border-black px-2 py-1">Cantidad</th>
                        <th className="border border-black px-2 py-1">Precio</th>
                        <th className="border border-black px-2 py-1">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {order.ProductVariations.map((item) => (
                        <tr key={item.variationID}>
                            <td className="border border-black px-2 py-1">{item.sku}</td>
                            <td className="border border-black px-2 py-1">{item.sizeNumber}</td>
                            <td className="border border-black px-2 py-1">{item.quantityOrdered}</td>
                            <td className="border border-black px-2 py-1">${toPrice(item.priceCost)}</td>
                            <td className="border border-black px-2 py-1">
                                ${toPrice(item.priceCost * item.quantityOrdered)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
