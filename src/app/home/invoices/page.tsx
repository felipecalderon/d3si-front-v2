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

    const handleCloseModal = () => {
        setIsModalOpen(false)
        // Limpiar el selectedOrder después de un pequeño delay para evitar flash
        setTimeout(() => {
            setSelectedOrder(null)
        }, 150)
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
        if (confirm("¿Estás seguro de que quieres anular esta orden?")) {
            await deleteOrder(orderID)
            setOrders((prev) => prev.filter((order) => order.orderID !== orderID))
        }
    }

    const handlePrint = (order: IOrderWithStore) => {
        setPrintOrder(order)
        setTimeout(() => {
            window.print()
            setPrintOrder(null) // Limpia después de imprimir
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
        <main className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Órdenes Generadas</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Gestiona y visualiza todas las órdenes del sistema
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50 dark:bg-slate-800">
                                <TableHead className="font-semibold">#</TableHead>
                                <TableHead className="font-semibold">Folio</TableHead>
                                <TableHead className="font-semibold">Fecha</TableHead>
                                <TableHead className="font-semibold">Tienda</TableHead>
                                <TableHead className="font-semibold">Total</TableHead>
                                <TableHead className="font-semibold">Estado</TableHead>
                                <TableHead className="font-semibold">Acciones</TableHead>
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
                                        <TableRow
                                            key={order.orderID}
                                            className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                                        >
                                            <TableCell className="font-medium text-gray-600 dark:text-gray-400">
                                                {i + 1}
                                            </TableCell>
                                            <TableCell>
                                                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">
                                                    {order.orderID.slice(0, 8)}
                                                </code>
                                            </TableCell>
                                            <TableCell className="text-gray-700 dark:text-gray-300">{fecha}</TableCell>
                                            <TableCell className="font-medium">
                                                {order.Store?.name || getStoreName(order.storeID)}
                                            </TableCell>
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
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDelete(order.orderID)}
                                                        className="hover:bg-red-700"
                                                    >
                                                        Anular
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                        </TableBody>
                    </Table>
                </div>

                {isLoading && (
                    <div className="p-8 text-center">
                        <div className="inline-flex items-center gap-2 text-gray-500">
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                            Cargando órdenes...
                        </div>
                    </div>
                )}

                {!isLoading && orders.length === 0 && (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            No hay órdenes generadas
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">Las órdenes que generes aparecerán aquí</p>
                    </div>
                )}
            </div>

            <OrderDetailModal open={isModalOpen} onClose={handleCloseModal} order={selectedOrder} />

            {printOrder && (
                <div id="print-area">
                    <PrintOrderView order={printOrder} />
                </div>
            )}
        </main>
    )
}
