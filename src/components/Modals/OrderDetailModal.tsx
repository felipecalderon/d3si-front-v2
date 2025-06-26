"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { IOrderWithStore } from "@/interfaces/orders/IOrderWithStore"

interface Props {
    open: boolean
    onClose: () => void
    order: IOrderWithStore | null
}

export default function OrderDetailModal({ open, onClose, order }: Props) {
    if (!order) return null

    const fecha = new Date(order.createdAt).toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Detalles de la Orden</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
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
                        <strong>Total:</strong> ${parseFloat(order.total).toFixed(2)}
                    </p>
                    <p>
                        <strong>Tipo:</strong> {order.type}
                    </p>
                    <p>
                        <strong>Descuento:</strong> ${parseFloat(order.discount || "0").toFixed(2)}
                    </p>

                    <hr />

                    <h3 className="font-semibold mt-4">Tienda:</h3>
                    <p>
                        <strong>Nombre:</strong> {order.Store?.name || "N/A"}
                    </p>
                    <p>
                        <strong>Dirección:</strong> {order.Store?.address || "N/A"}
                    </p>
                    <p>
                        <strong>Teléfono:</strong> {order.Store?.phone || "N/A"}
                    </p>

                    <hr />

                    <h3 className="font-semibold mt-4">Productos:</h3>
                    {order.ProductVariations && order.ProductVariations.length > 0 ? (
                        <table className="w-full text-sm border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 px-2 py-1">SKU</th>
                                    <th className="border border-gray-300 px-2 py-1">Talla</th>
                                    <th className="border border-gray-300 px-2 py-1">Cantidad</th>
                                    <th className="border border-gray-300 px-2 py-1">Precio Unitario</th>
                                    <th className="border border-gray-300 px-2 py-1">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.ProductVariations.map((item) => (
                                    <tr key={item.variationID}>
                                        <td className="border border-gray-300 px-2 py-1">{item.sku}</td>
                                        <td className="border border-gray-300 px-2 py-1">{item.sizeNumber}</td>
                                        <td className="border border-gray-300 px-2 py-1">{item.quantityOrdered}</td>
                                        <td className="border border-gray-300 px-2 py-1">
                                            ${parseFloat(item.priceList).toFixed(2)}
                                        </td>
                                        <td className="border border-gray-300 px-2 py-1">
                                            ${item.subtotal.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No hay productos en esta orden.</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
