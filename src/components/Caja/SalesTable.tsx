"use client"

import React from "react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { ISaleResponse } from "@/interfaces/sales/ISale"
import DateCell from "../DateCell"
import { useRouter } from "next/navigation"
import { toPrice } from "@/utils/priceFormat"

interface Props {
    sales: ISaleResponse[]
}

export const SalesTable: React.FC<Props> = ({ sales }) => {
    const { push } = useRouter()
    return (
        <div className="dark:bg-gray-800 bg-white rounded shadow overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead align="center">Sucursal</TableHead>
                        <TableHead align="center">Fecha</TableHead>
                        <TableHead align="center">Monto</TableHead>
                        <TableHead align="center">Productos</TableHead>
                        <TableHead align="center">Estado</TableHead>
                        <TableHead align="center">Tipo de pago</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="max-h-96 overflow-y-auto">
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
                                      return `${quantity} x ${productName}`
                                  }).join(", ")
                                : "-"

                            return (
                                <TableRow
                                    key={sale.saleID}
                                    className="cursor-pointer"
                                    onClick={() => push(`/home/${sale.saleID}?storeID=${sale.storeID}`)}
                                >
                                    <TableCell align="left">{storeName}</TableCell>
                                    <TableCell align="left">
                                        <DateCell date={sale.createdAt} />
                                    </TableCell>
                                    <TableCell align="left">
                                        {typeof sale.total === "number" ? `$${toPrice(sale.total)}` : "Sin dato"}
                                    </TableCell>
                                    <TableCell align="left" className="max-w-96">
                                        {productsDescription}
                                    </TableCell>
                                    <TableCell
                                        className={`font-medium ${
                                            sale.status === "Pagado"
                                                ? "text-green-600"
                                                : sale.status === "Pendiente"
                                                ? "text-yellow-500"
                                                : "text-rose-700"
                                        }`}
                                    >
                                        {sale.status}
                                    </TableCell>
                                    <TableCell align="center">{sale.paymentType}</TableCell>
                                </TableRow>
                            )
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default SalesTable
