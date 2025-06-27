"use client"

import React, { useEffect, useState } from "react"
import { getAllOrders } from "@/actions/orders/getAllOrders"
import { getAllStores } from "@/actions/stores/getAllStores"
import { IStore } from "@/interfaces/stores/IStore"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { deleteOrder } from "@/actions/orders/deleteOrder"
import OrderDetailModal from "@/components/Modals/OrderDetailModal"
import { IOrderWithStore } from "@/interfaces/orders/IOrderWithStore"
import PrintOrderView from "@/components/Print/PrintOrderView"

export default function InvoicesPage() {
    const [orders, setOrders] = useState<IOrderWithStore[]>([])
    const [stores, setStores] = useState<IStore[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState<IOrderWithStore | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [printOrder, setPrintOrder] = useState<IOrderWithStore | null>(null)

    const handleView = (order: IOrderWithStore) => {
        setSelectedOrder(order)
        setIsModalOpen(true)
    }

    useEffect(() => {
        async function fetchData() {
            const [ordersData, storesData] = await Promise.all([getAllOrders(), getAllStores()])
            setOrders(ordersData)
            setStores(storesData)
            setIsLoading(false)
        }
        fetchData()
    }, [])

    const getStoreName = (storeID: string) => {
        return stores.find((s) => s.storeID === storeID)?.name || "Tienda no encontrada"
    }

    const handleDelete = async (orderID: string) => {
        await deleteOrder(orderID)
        setOrders((prev) => prev.filter((order) => order.orderID !== orderID))
    }

    const handlePrint = (order: IOrderWithStore) => {
        setPrintOrder(order)
        setTimeout(() => {
            window.print()
            setPrintOrder(null) // Limpia después de imprimir
        }, 100)
    }

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-4">Órdenes generadas</h1>

            <div className="rounded border bg-white dark:bg-slate-900 shadow overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
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
                        {!isLoading &&
                            orders.map((order, i) => {
                                const fecha = new Date(order.createdAt).toLocaleDateString("es-MX", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })
                                const total = parseFloat(order.total).toFixed(2)

                                return (
                                    <TableRow key={order.orderID}>
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell className="font-medium">{order.orderID.slice(0, 8)}</TableCell>
                                        <TableCell>{fecha}</TableCell>
                                        <TableCell>{order.Store?.name || getStoreName(order.storeID)}</TableCell>
                                        <TableCell>${total}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                                    order.status === "Pendiente"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-green-100 text-green-800"
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleView(order)}>
                                                Ver
                                            </Button>
                                            <Button size="sm" onClick={() => handlePrint(order)}>
                                                Imprimir
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(order.orderID)}
                                            >
                                                Anular
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                    </TableBody>
                </Table>

                {isLoading && <p className="p-4 text-gray-500 text-sm">Cargando órdenes...</p>}
                {!isLoading && orders.length === 0 && (
                    <p className="p-4 text-gray-500 text-sm">No hay órdenes generadas aún.</p>
                )}
            </div>

            <OrderDetailModal
                open={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedOrder(null)
                }}
                order={selectedOrder}
            />

            {printOrder && (
                <div id="print-area">
                    <PrintOrderView order={printOrder} />
                </div>
            )}
        </main>
    )
}
