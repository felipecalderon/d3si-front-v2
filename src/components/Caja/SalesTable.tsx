"use client"

import React from "react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { ISaleResponse } from "@/interfaces/sales/ISale"
import { IOrderWithStore } from "@/interfaces/orders/IOrderWithStore"
import DateCell from "../DateCell"
import { useRouter } from "next/navigation"
import { toPrice } from "@/utils/priceFormat"

type TableItem = ISaleResponse | (IOrderWithStore & { isOrder: true })

interface Props {
    items: TableItem[]
}

const SalesTable: React.FC<Props> = ({ items }) => {
    const { push } = useRouter()
    const urlRedirectToSingleSale = (item: TableItem) => {
        if ("saleID" in item) {
            // Es venta
            if (item.storeID === "web") {
                push(`/home/ventaweb/${item.saleID}?storeID=${item.storeID}`)
            } else {
                push(`/home/${item.saleID}?storeID=${item.storeID}`)
            }
        } else {
            // Es orden de compra
            push(`/home/order/${item.orderID}?storeID=${item.storeID}`)
        }
    }
    return (
        <div className="dark:bg-gray-800 bg-white rounded shadow overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead align="center">Origen</TableHead>
                        <TableHead align="center">Fecha</TableHead>
                        <TableHead align="center">Monto</TableHead>
                        <TableHead align="center">Productos</TableHead>
                        <TableHead align="center">Estado</TableHead>
                        <TableHead align="center">Tipo de pago</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="max-h-96 overflow-y-auto">
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6}>No hay ventas ni órdenes para mostrar.</TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => {
                            // Venta
                            if ("saleID" in item) {
                                const storeName = item.Store?.name || "Sucursal"
                                const productsDescription = item.SaleProducts?.length
                                    ? item.SaleProducts.map((sp) => {
                                          const productName =
                                              sp?.StoreProduct?.ProductVariation?.Product?.name ?? "Producto"
                                          const quantity = sp.quantitySold ?? "-"
                                          return `${quantity} x ${productName}`
                                      }).join(", ")
                                    : "-"
                                return (
                                    <TableRow
                                        key={item.saleID}
                                        className="cursor-pointer"
                                        onClick={() => urlRedirectToSingleSale(item)}
                                    >
                                        <TableCell align="left">{storeName}</TableCell>
                                        <TableCell align="left">
                                            <DateCell date={item.createdAt} />
                                        </TableCell>
                                        <TableCell align="left">
                                            {typeof item.total === "number" ? `$${toPrice(item.total)}` : "Sin dato"}
                                        </TableCell>
                                        <TableCell align="left" className="max-w-96">
                                            {productsDescription}
                                        </TableCell>
                                        <TableCell
                                            className={`font-medium ${
                                                item.status === "Pagado"
                                                    ? "text-green-600"
                                                    : item.status === "Pendiente"
                                                    ? "text-yellow-500"
                                                    : "text-rose-700"
                                            }`}
                                        >
                                            {item.status}
                                        </TableCell>
                                        <TableCell align="center">{item.paymentType}</TableCell>
                                    </TableRow>
                                )
                            } else {
                                // Orden de compra
                                const storeName = item.Store?.name || "Sucursal"
                                const productsDescription = item.ProductVariations?.length
                                    ? item.ProductVariations.map((pv) => {
                                          const productName = pv.Product?.name ?? "Producto"
                                          const quantity = pv.quantityOrdered ?? "-"
                                          return `${quantity} x ${productName}`
                                      }).join(", ")
                                    : "-"
                                return (
                                    <TableRow
                                        key={item.orderID}
                                        className="cursor-pointer"
                                        onClick={() => urlRedirectToSingleSale(item)}
                                    >
                                        <TableCell align="left">{storeName}</TableCell>
                                        <TableCell align="left">
                                            <DateCell date={item.createdAt} />
                                        </TableCell>
                                        <TableCell align="left">
                                            {item.total ? `$${toPrice(Number(item.total))}` : "Sin dato"}
                                        </TableCell>
                                        <TableCell align="left" className="max-w-96">
                                            {productsDescription}
                                        </TableCell>
                                        <TableCell
                                            className={`font-medium ${
                                                item.status === "Pagado"
                                                    ? "text-green-600"
                                                    : item.status === "Pendiente"
                                                    ? "text-yellow-500"
                                                    : "text-rose-700"
                                            }`}
                                        >
                                            {item.status}
                                        </TableCell>
                                        <TableCell align="center">{item.type}</TableCell>
                                    </TableRow>
                                )
                            }
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default SalesTable
