"use client"

import React, { useEffect, useState } from "react"
import { useTienda } from "@/stores/tienda.store"
import { IOrderWithStore } from "@/interfaces/orders/IOrderWithStore"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { deleteOrder } from "@/actions/orders/deleteOrder"
import { InvoicesClientProps } from "@/interfaces/invoices/IInvoices"
import { useAuth } from "@/stores/user.store"
import { Role } from "@/lib/userRoles"
import { toPrice } from "@/utils/priceFormat"
import { useRouter } from "next/navigation"

export default function InvoicesClient({ initialOrders, stores }: InvoicesClientProps) {
    const { user } = useAuth()
    const { storeSelected } = useTienda()
    const isStoreManager = user?.role === Role.Vendedor
    const isAdmin = user?.role === Role.Admin
    const route = useRouter()

    const [orders, setOrders] = useState<IOrderWithStore[]>([])

    const handleView = (order: IOrderWithStore) => {
        route.push(`/home/order/${order.orderID}`)
    }

    const getStoreName = (storeID: string) => {
        return stores.find((s) => s.storeID === storeID)?.name || "Tienda no encontrada"
    }

    const handleDelete = async (orderID: string) => {
        if (confirm("¿Estás seguro de que quieres borrar esta orden?")) {
            await deleteOrder(orderID)
            setOrders((prev) => prev.filter((order) => order.orderID !== orderID))
        }
    }

    useEffect(() => {
        // Filtrar órdenes según el rol
        let filteredOrders: IOrderWithStore[] = []

        if (isAdmin) {
            filteredOrders = initialOrders
        } else if (user?.role === Role.Tercero && user.userID) {
            // Si es tercero, mostrar solo las órdenes creadas por el usuario logueado
            filteredOrders = initialOrders.filter((order) => order.userID === user.userID)
        } else if (isStoreManager && storeSelected?.storeID) {
            // Si es gestor de tienda, mostrar solo las órdenes de la tienda seleccionada
            filteredOrders = initialOrders.filter((order) => order.storeID === storeSelected.storeID)
        }

        setOrders(filteredOrders)
    }, [user, initialOrders, storeSelected, isAdmin, isStoreManager])

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
                            <TableHead>Total Neto</TableHead>
                            <TableHead>Total + IVA</TableHead>
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
                            const total = Math.round(Number(order.total))
                            const totalConIVA = Math.round(total * 1.19)
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
                                        ${toPrice(total)}
                                    </TableCell>
                                    <TableCell className="font-semibold text-blue-600 dark:text-blue-400">
                                        ${toPrice(totalConIVA)}
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
                                            {(!isStoreManager || user.role === Role.Consignado || isAdmin) && (
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(order.orderID)}
                                                    className="hover:bg-red-700"
                                                >
                                                    Borrar
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
        </div>
    )
}
