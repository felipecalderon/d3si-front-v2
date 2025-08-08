"use client"

import React, { useState } from "react"
import { IOrderWithStore } from "@/interfaces/orders/IOrderWithStore"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
// import OrderDetailModal from "@/components/Modals/OrderDetailModal"
import PrintOrderView from "@/components/Print/PrintOrderView"
import { deleteOrder } from "@/actions/orders/deleteOrder"
import { InvoicesClientProps } from "@/interfaces/invoices/IInvoices"
import { useAuth } from "@/stores/user.store"
import { Role } from "@/lib/userRoles"

export default function InvoicesClient({ initialOrders, stores }: InvoicesClientProps) {
    const { user } = useAuth()
    const isStoreManager = user?.role === Role.Vendedor
    const isAdmin = user?.role === Role.Admin
    const [orders, setOrders] = useState<IOrderWithStore[]>(initialOrders)
    const [selectedOrder, setSelectedOrder] = useState<IOrderWithStore | null>(null)
    const [printOrder, setPrintOrder] = useState<IOrderWithStore | null>(null)

    const handleView = (order: IOrderWithStore) => {
        window.location.href = `/home/order/${order.orderID}`
    }

    const getStoreName = (storeID: string) => {
        return stores.find((s) => s.storeID === storeID)?.name || "Tienda no encontrada"
    }

    const handleDelete = async (orderID: string) => {
        if (confirm("¿Estás seguro de que quieres anular esta orden?")) {
            await deleteOrder(orderID)
            setOrders((prev) => prev.filter((order) => order.orderID !== orderID))
        }
    }

    const handlePrint = (order: IOrderWithStore) => {
        setPrintOrder(order)
        setTimeout(() => {
            window.print()
            setPrintOrder(null)
        }, 100)
    }

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            Pendiente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
            Completado: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
            Cancelado: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
            "En proceso": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        }
        return (
            statusConfig[status as keyof typeof statusConfig] ||
            "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
        )
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-slate-800">
                            <TableHead>#</TableHead>
                            <TableHead>Folio</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Tienda</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order, i) => {
                            const fecha = new Date(order.createdAt).toLocaleDateString("es-MX", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })
                            const total = Math.round(parseFloat(order.total))
                            return (
                                <TableRow
                                    key={order.orderID}
                                    className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell>
                                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">
                                            {order.orderID.slice(0, 8)}
                                        </code>
                                    </TableCell>
                                    <TableCell>{fecha}</TableCell>
                                    <TableCell>{order.Store?.name || getStoreName(order.storeID)}</TableCell>
                                    <TableCell className="font-semibold text-green-600 dark:text-green-400">
                                        ${total}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                                                order.status
                                            )}`}
                                        >
                                            {order.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2 flex-wrap">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleView(order)}
                                                className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 dark:hover:bg-blue-950 dark:hover:text-blue-300"
                                            >
                                                Ver
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => handlePrint(order)}
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                Imprimir
                                            </Button>
                                            {(!isStoreManager || user.role === Role.Consignado || isAdmin) && (
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(order.orderID)}
                                                    className="hover:bg-red-700"
                                                >
                                                    Anular
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>

            {orders.length === 0 && (
                <div className="p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No hay órdenes generadas
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">Las órdenes que generes aparecerán aquí</p>
                </div>
            )}

            {/* <OrderDetailModal open={isModalOpen} onClose={handleCloseModal} order={selectedOrder} /> */}

            {printOrder && (
                <div id="print-area">
                    <PrintOrderView order={printOrder} />
                </div>
            )}
        </div>
    )
}
