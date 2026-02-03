"use client"

import React, { useMemo, useState } from "react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { ISaleResponse } from "@/interfaces/sales/ISale"
import { IOrderWithStore } from "@/interfaces/orders/IOrderWithStore"
import DateCell from "../DateCell"
import { useRouter } from "next/navigation"
import { toPrice } from "@/utils/priceFormat"
import { getAnulatedProducts } from "@/lib/getAnulatedProducts"
import { Search } from "lucide-react"

type TableItem = ISaleResponse | IOrderWithStore

interface Props {
    items: TableItem[]
}

const normalizeText = (value: unknown) => {
    if (value === null || value === undefined) return ""
    return String(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
}

const buildSearchText = (item: TableItem) => {
    const createdAt = (item as any)?.createdAt
    const createdAtDate = createdAt ? new Date(createdAt) : null
    const dateSearch =
        createdAtDate && !Number.isNaN(createdAtDate.getTime())
            ? [
                  createdAtDate.toISOString(),
                  createdAtDate.toLocaleDateString("es-CL"),
                  createdAtDate.toLocaleString("es-CL"),
              ].join(" ")
            : String(createdAt ?? "")

    // Venta
    if ("saleID" in item) {
        const storeName = item.Store?.name || "Sucursal"
        const nulledProducts = getAnulatedProducts(item)
        const totalNulledAmount = nulledProducts.reduce((acc, p) => acc + p.quantitySold * p.unitPrice, 0)
        const totalNulledUnits = nulledProducts.reduce((acc, p) => acc + p.quantitySold, 0)

        const productsText = (item.SaleProducts ?? [])
            .map((sp) => {
                const nulled = nulledProducts.find((np) => np.storeProductID === sp.storeProductID)
                const actualQuantity = sp.quantitySold - (nulled?.quantitySold || 0)
                if (actualQuantity <= 0) return null

                const name = sp?.StoreProduct?.ProductVariation?.Product?.name ?? "Producto"
                const sizeNumber = sp?.StoreProduct?.ProductVariation?.sizeNumber ?? ""
                return `${actualQuantity} x ${name}${sizeNumber ? ` - ${sizeNumber}` : ""}`
            })
            .filter(Boolean)
            .join(" ")

        const saleFullyNulled =
            (item.SaleProducts ?? []).length > 0 &&
            item.SaleProducts.every((sp) => {
                const nulled = nulledProducts.find((np) => np.storeProductID === sp.storeProductID)
                return sp.quantitySold - (nulled?.quantitySold || 0) <= 0
            })

        const statusText =
            item.status === "Anulado" && totalNulledUnits > 0
                ? `Anulado (${totalNulledUnits} ${totalNulledUnits === 1 ? "producto" : "productos"})`
                : item.status

        const amountText = typeof item.total === "number" ? `$${toPrice(item.total - totalNulledAmount)}` : "Sin dato"

        return [
            storeName,
            dateSearch,
            productsText,
            saleFullyNulled ? "Venta anulada por completo" : "",
            statusText,
            item.paymentType,
            amountText,
        ].join(" ")
    }

    // Orden de compra
    const storeName = item.Store?.name || "Sucursal"
    const itemsOrdered = item.ProductVariations?.reduce((acc, p) => acc + p.quantityOrdered, 0) ?? ""
    const amountText = item.total ? `$${toPrice(Number(item.total))}` : "Sin dato"
    return [storeName, dateSearch, `${itemsOrdered} unidades`, item.status, item.type, amountText].join(" ")
}

const SalesTable: React.FC<Props> = ({ items }) => {
    const { push } = useRouter()

    const [searchTerm, setSearchTerm] = useState("")
    const filteredItems = useMemo(() => {
        const query = normalizeText(searchTerm)
        if (!query) return items
        return items.filter((item) => normalizeText(buildSearchText(item)).includes(query))
    }, [items, searchTerm])

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
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por origen, fecha, productos, estado, tipo de pago o monto..."
                        className="pl-9"
                    />
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead align="center">Origen</TableHead>
                        <TableHead align="center">Fecha</TableHead>
                        <TableHead align="center">Productos</TableHead>
                        <TableHead align="center">Estado</TableHead>
                        <TableHead align="center">Tipo de pago</TableHead>
                        <TableHead align="center">Monto</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="max-h-96 overflow-y-auto">
                    {filteredItems.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6}>No hay ventas ni órdenes para mostrar.</TableCell>
                        </TableRow>
                    ) : (
                        filteredItems.map((item) => {
                            // Venta
                            if ("saleID" in item) {
                                const storeName = item.Store?.name || "Sucursal"
                                const nulledProducts = getAnulatedProducts(item)
                                const totalNulledAmount = nulledProducts.reduce(
                                    (acc, p) => acc + p.quantitySold * p.unitPrice,
                                    0,
                                )
                                const totalNulledUnits = nulledProducts.reduce((acc, p) => acc + p.quantitySold, 0)

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
                                        <TableCell align="left" className="max-w-96">
                                            {item.SaleProducts.map((sp) => {
                                                const nulled = nulledProducts.find(
                                                    (np) => np.storeProductID === sp.storeProductID,
                                                )
                                                const actualQuantity = sp.quantitySold - (nulled?.quantitySold || 0)

                                                if (actualQuantity <= 0) return null

                                                const { name } =
                                                    sp?.StoreProduct?.ProductVariation?.Product ?? "Producto"
                                                const { sizeNumber } = sp?.StoreProduct?.ProductVariation
                                                return (
                                                    <p key={sp.SaleProductID}>
                                                        {actualQuantity} x {name} - {sizeNumber}
                                                    </p>
                                                )
                                            })}
                                            {item.SaleProducts.every((sp) => {
                                                const nulled = nulledProducts.find(
                                                    (np) => np.storeProductID === sp.storeProductID,
                                                )
                                                return sp.quantitySold - (nulled?.quantitySold || 0) <= 0
                                            }) && <p className="text-rose-600 italic">Venta anulada por completo</p>}
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
                                            {item.status === "Anulado" && totalNulledUnits > 0
                                                ? `Anulado (${totalNulledUnits} ${
                                                      totalNulledUnits === 1 ? "producto" : "productos"
                                                  })`
                                                : item.status}
                                        </TableCell>
                                        <TableCell align="center">{item.paymentType}</TableCell>
                                        <TableCell align="left">
                                            {typeof item.total === "number"
                                                ? `$${toPrice(item.total - totalNulledAmount)}`
                                                : "Sin dato"}
                                        </TableCell>
                                    </TableRow>
                                )
                            } else {
                                // Orden de compra
                                const storeName = item.Store?.name || "Sucursal"
                                const itemsOrdered = item.ProductVariations?.reduce(
                                    (acc, p) => acc + p.quantityOrdered,
                                    0,
                                )
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
                                        <TableCell align="left" className="max-w-96">
                                            {itemsOrdered} unidades
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
                                        <TableCell align="left">
                                            {item.total ? `$${toPrice(Number(item.total))}` : "Sin dato"}
                                        </TableCell>
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
