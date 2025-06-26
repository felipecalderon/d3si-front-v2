"use client"

import React from "react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { ISaleResponse } from "@/interfaces/sales/ISale"
import DateCell from "@/components/DateCell"

interface Props {
    sales: ISaleResponse[]
}

export const SalesTable: React.FC<Props> = ({ sales }) => {
    return (
        <div className="dark:bg-slate-700 bg-white rounded shadow overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Sucursal</TableHead>
                        <TableHead>Fecha de Venta</TableHead>
                        <TableHead>Venta con IVA</TableHead>
                        <TableHead>Productos</TableHead>
                        <TableHead>Estado</TableHead>
                    </TableRow>
                </TableHeader>
            </Table>

            <div
                className={`dark:bg-slate-700 bg-white rounded shadow ${
                    sales.length > 8 ? "max-h-[32rem] overflow-y-auto" : ""
                }`}
            >
                <Table>
                    <TableBody>
                        {sales.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5}>No hay ventas para mostrar.</TableCell>
                            </TableRow>
                        ) : (
                            sales.map((sale) => {
                                const storeName = sale.Store?.name || "Sucursal"
                                const productsDescription = sale.SaleProducts?.length
                                    ? sale.SaleProducts.map((sp) => {
                                        const productName =
                                            sp?.StoreProduct?.ProductVariation?.Product?.name ?? "Producto"
                                        const quantity = sp.quantitySold ?? "-"
                                        const price = sp.unitPrice ?? "-"
                                        return `${quantity} x ${productName} ($${price})`
                                    }).join(", ")
                                    : "-"

                                return (
                                    <TableRow key={sale.saleID}>
                                        <TableCell>{storeName}</TableCell>
                                        <TableCell>
                                            <DateCell date={sale.createdAt} />
                                        </TableCell>

                                        <TableCell>
                                            {typeof sale.total === "number"
                                                ? `$${sale.total.toLocaleString("es-AR")}`
                                                : "Sin dato"}
                                        </TableCell>
                                        <TableCell>{productsDescription}</TableCell>
                                        <TableCell className="text-green-600 font-medium">{sale.status}</TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default SalesTable
