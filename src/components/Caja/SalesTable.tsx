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
            <div className="overflow-x-auto w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-[150px]">Sucursal</TableHead>
                            <TableHead className="min-w-[150px]">Fecha</TableHead>
                            <TableHead className="min-w-[150px]">Monto</TableHead>
                            <TableHead className="min-w-[150px]">Productos</TableHead>
                            <TableHead className="min-w-[150px]">Estado</TableHead>
                            <TableHead className="min-w-[150px]">Tipo de pago</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
            </div>

            <div
                className={`dark:bg-gray-800 bg-white rounded shadow ${
                    sales.length > 8 ? "max-h-[32rem] overflow-y-auto" : ""
                }`}
            >
                <div className="overflow-x-auto w-full">
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
                                              return `${quantity} x ${productName}`
                                          }).join(", ")
                                        : "-"

                                    return (
                                        <TableRow
                                            key={sale.saleID}
                                            className="cursor-pointer"
                                            onClick={() => push(`/home/${sale.saleID}?storeID=${sale.storeID}`)}
                                        >
                                            <TableCell className="min-w-[150px]">{storeName}</TableCell>
                                            <TableCell className="min-w-[150px]">
                                                <DateCell date={sale.createdAt} />
                                            </TableCell>
                                            <TableCell className="min-w-[150px]">
                                                {typeof sale.total === "number"
                                                    ? `$${toPrice(sale.total)}`
                                                    : "Sin dato"}
                                            </TableCell>
                                            <TableCell className="min-w-[150px]">{productsDescription}</TableCell>
                                            <TableCell className="text-green-600 min-w-[160px] font-medium">
                                                {sale.status}
                                            </TableCell>
                                            <TableCell className="min-w-[150px]">{sale.paymentType}</TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default SalesTable
