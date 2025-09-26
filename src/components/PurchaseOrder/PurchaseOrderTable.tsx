"use client"

import React from "react"
import Image from "next/image"
import { useAuth } from "@/stores/user.store"
import { Role } from "@/lib/userRoles"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MotionItem } from "@/components/Animations/motionItem"
import type { IProduct } from "@/interfaces/products/IProduct"

interface PurchaseOrderTableProps {
    currentItems: Array<{
        product: IProduct
        variation: any
        isFirst: boolean
    }>
    pedido: Record<string, number>
    setPedido: React.Dispatch<React.SetStateAction<Record<string, number>>>
    selectedStoreID: string
}

export function PurchaseOrderTable({ currentItems, pedido, setPedido, selectedStoreID }: PurchaseOrderTableProps) {
    const { user } = useAuth()
    const isAdmin = user?.role === Role.Admin
    //const isSpecialRole = [Role.Vendedor, Role.Consignado, Role.Tercero].includes(user?.role ?? "")
    return (
        <div className="flex-1 flex flex-col">
            <div className="flex-1 dark:bg-slate-900 bg-white shadow rounded overflow-hidden">
                <div className="overflow-x-auto h-full">
                    <Table>
                        <TableHeader className="sticky top-0 bg-gray-50 dark:bg-slate-800">
                            <TableRow>
                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                    PRODUCTO
                                </TableHead>
                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                    SKU
                                </TableHead>
                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                    TALLA
                                </TableHead>
                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                    {isAdmin ? "COSTO NETO" : "PRECIO PLAZA"}
                                </TableHead>
                                {isAdmin && (
                                    <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                        STOCK CENTRAL
                                    </TableHead>
                                )}
                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                    STOCK TIENDA
                                </TableHead>
                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                    CANTIDAD PEDIDO
                                </TableHead>
                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                    SUBTOTAL
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {currentItems.map(({ product, variation, isFirst }, index) => {
                                // Stock de la tienda seleccionada
                                let stockTienda = 0
                                if (selectedStoreID) {
                                    const storeProduct = variation.StoreProducts?.find(
                                        (sp: any) => sp.storeID === selectedStoreID
                                    )
                                    stockTienda = storeProduct ? storeProduct.quantity : 0
                                }

                                const pedidoQuantity = pedido[variation.sku] || 0
                                const subtotalVariation = isAdmin
                                    ? pedidoQuantity * (variation.priceCost ?? 0)
                                    : pedidoQuantity * (variation.priceList ?? 0)

                                return (
                                    <TableRow
                                        key={`${product.productID}-${variation.variationID}`}
                                        className={`group hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-200 ${
                                            isFirst
                                                ? "border-t-2 border-t-slate-200 dark:border-t-slate-400"
                                                : "border-t border-gray-100 dark:border-gray-700"
                                        } text-sm dark:text-gray-300 text-gray-800 h-16`}
                                    >
                                        {/* Columna PRODUCTO */}
                                        {isFirst && (
                                            <TableCell className="py-2 px-3 text-left w-1/4">
                                                <MotionItem key={`product-${product.productID}`} delay={index + 2}>
                                                    <div className="relative w-full flex items-center gap-3">
                                                        <div className="relative">
                                                            <Image
                                                                src={product.image || "/placeholder.svg"}
                                                                alt={product.name}
                                                                width={48}
                                                                height={48}
                                                                className="w-12 h-12 object-cover rounded border"
                                                                style={{ objectFit: "cover" }}
                                                            />
                                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                                                {product.ProductVariations.length}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <span className="font-medium text-sm block truncate">
                                                                {product.name}
                                                            </span>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full font-medium">
                                                                    {product.ProductVariations.length} variaciones
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </MotionItem>
                                            </TableCell>
                                        )}
                                        {!isFirst && (
                                            <TableCell className="text-center dark:hover:bg-gray-900 hover:bg-gray-100 py-2"></TableCell>
                                        )}

                                        {/* Columna SKU */}
                                        <TableCell className="text-center dark:hover:bg-gray-900 hover:bg-gray-100 py-2">
                                            <MotionItem key={`sku-${variation.variationID}`} delay={index + 2}>
                                                <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                    {variation.sku}
                                                </span>
                                            </MotionItem>
                                        </TableCell>

                                        {/* Columna TALLA */}
                                        <TableCell className="text-center dark:hover:bg-gray-900 hover:bg-gray-100 py-2">
                                            <MotionItem key={`size-${variation.variationID}`} delay={index + 2}>
                                                <span className="font-medium">{variation.sizeNumber}</span>
                                            </MotionItem>
                                        </TableCell>

                                        {/* Columna PRECIO LISTA o COSTO */}
                                        <TableCell className="w-32 text-center py-3 transition-colors">
                                            <MotionItem key={`price-${variation.variationID}`} delay={index + 2}>
                                                <span className="font-semibold text-sm">
                                                    {isAdmin
                                                        ? `$${Math.round(Number(variation.priceCost)).toLocaleString(
                                                              "es-CO"
                                                          )}`
                                                        : `$${Math.round(Number(variation.priceList)).toLocaleString(
                                                              "es-CO"
                                                          )}`}
                                                </span>
                                            </MotionItem>
                                        </TableCell>

                                        {/* Columna STOCK CENTRAL (solo si no es consignado, tercero o vendedor) */}
                                        {isAdmin && (
                                            <TableCell className="w-32 text-center py-3 transition-colors">
                                                <MotionItem key={`central-${variation.variationID}`} delay={index + 2}>
                                                    <Badge
                                                        variant={
                                                            variation.stockQuantity < 20 ? "destructive" : "default"
                                                        }
                                                        className="font-bold text-sm"
                                                    >
                                                        {variation.stockQuantity}
                                                    </Badge>
                                                </MotionItem>
                                            </TableCell>
                                        )}

                                        {/* Columna STOCK TIENDA */}
                                        <TableCell className="text-center dark:hover:bg-gray-900 hover:bg-gray-100 py-2">
                                            <MotionItem key={`store-${variation.variationID}`} delay={index + 2}>
                                                <span className="font-medium text-blue-600 dark:text-blue-400">
                                                    {stockTienda}
                                                </span>
                                            </MotionItem>
                                        </TableCell>

                                        {/* Columna CANTIDAD PEDIDO */}
                                        <TableCell className="w-32 text-center py-3 transition-colors">
                                            <MotionItem key={`order-${variation.variationID}`} delay={index + 2}>
                                                <div className="flex justify-center">
                                                    <Input
                                                        type="number"
                                                        className="w-16 h-8 text-center text-xs border-2"
                                                        value={pedidoQuantity || ""}
                                                        onChange={(e) => {
                                                            const val = Number.parseInt(e.target.value) || 0
                                                            setPedido((prev) => ({
                                                                ...prev,
                                                                [variation.sku]: val,
                                                            }))
                                                        }}
                                                        onWheel={(e) => {
                                                            e.currentTarget.blur()
                                                        }}
                                                        min="0"
                                                    />
                                                </div>
                                            </MotionItem>
                                        </TableCell>

                                        {/* Columna SUBTOTAL */}
                                        <TableCell className="w-32 text-center py-3 transition-colors">
                                            <MotionItem key={`subtotal-${variation.variationID}`} delay={index + 2}>
                                                <span className="font-semibold text-green-600 dark:text-green-400">
                                                    $
                                                    {subtotalVariation.toLocaleString("es-CL", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}
                                                </span>
                                            </MotionItem>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
