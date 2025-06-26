"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { IOrder } from "@/interfaces/orders/IOrder"

interface Props {
    open: boolean
    onClose: () => void
    order: IOrder | null
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
                    {/* Aquí se pueden incluir mas detalles que mande el backend de la orden */}
                </div>
            </DialogContent>
        </Dialog>
    )
}
