"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useAuth } from "@/stores/user.store"
import { Role } from "@/lib/userRoles"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MotionItem } from "@/components/Animations/motionItem"
import type { IProduct } from "@/interfaces/products/IProduct"
import { IProductVariation } from "@/interfaces/products/IProductVariation"
import { toPrice } from "@/utils/priceFormat"

interface PurchaseOrderTableProps {
    currentItems: Array<{
        product: IProduct
        variation: IProductVariation
        isFirst: boolean
    }>
    pedido: Record<string, number>
    setPedido: React.Dispatch<React.SetStateAction<Record<string, number>>>
    selectedStoreID: string
}

export function PurchaseOrderTable({ currentItems, pedido, setPedido, selectedStoreID }: PurchaseOrderTableProps) {
    const { user } = useAuth()
    const isAdmin = user?.role === Role.Admin
    const isTercero = user?.role === Role.Tercero

    // Estado para alternar orden secundario
    const [orderByMarkup, setOrderByMarkup] = useState(false)
    const [markupTerceroMin, setMarkupTerceroMin] = useState(1.7)
    const [markupTerceroMax, setMarkupTerceroMax] = useState(3.0)
    const [markupFlotanteMin, setMarkupFlotanteMin] = useState(1.4)

    // Función para calcular markup
    const calculateMarkup = (priceCost: number, priceList: number): number => {
        if (!priceCost) return 0
        return priceList / priceCost
    }

    const IVA = 1.19

    const calculateThirdPartyPrice = (priceList: number, step = 0.01) => {
        for (
            let markupFlotante = markupTerceroMin * IVA;
            markupFlotante <= markupTerceroMax * IVA;
            markupFlotante += step
        ) {
            const costoNetoTercero = priceList / markupFlotante
            const brutoCompra = costoNetoTercero * IVA
            const markupTercero = priceList / brutoCompra

            if (markupTercero >= markupTerceroMin && markupTercero <= markupTerceroMax) {
                return {
                    markupFlotante: parseFloat(markupFlotante.toFixed(3)),
                    costoNetoTercero: parseFloat(costoNetoTercero.toFixed(2)),
                    brutoCompra: parseFloat(brutoCompra.toFixed(2)),
                    markupTercero: parseFloat(markupTercero.toFixed(2)),
                }
            }
        }
        return null
    }

    // Filtrar productos por markup si es tercero
    let filteredItems = [...currentItems]
    if (isTercero) {
        filteredItems = filteredItems.filter(({ variation }) => {
            const priceList = Number(variation.priceList)
            const priceCost = Number(variation.priceCost)
            const third = calculateThirdPartyPrice(priceList)

            if (!third || !priceCost) return false

            // Markup flotante: cuánto sube el brutoCompra respecto al costo origen ===
            const markupFlotante = third.brutoCompra / priceCost

            // Markup del tercero: relación entre precio de lista y su costo con IVA ===
            const markupTercero = priceList / third.brutoCompra

            // Cumple ambas condiciones:
            // - markupTercero entre 1.7 y 3.0
            // - markupFlotante >= 1.4
            return (
                markupTercero >= markupTerceroMin &&
                markupTercero <= markupTerceroMax &&
                markupFlotante >= markupFlotanteMin
            )
        })
    }

    // Ordenar: primero D3SI, luego Otro; dentro de cada grupo, stock o markup de mayor a menor
    const sortedItems = filteredItems.sort((a, b) => {
        // Marca primero
        if (a.product.brand === "D3SI" && b.product.brand !== "D3SI") return -1
        if (a.product.brand !== "D3SI" && b.product.brand === "D3SI") return 1
        if (isTercero && orderByMarkup) {
            // Ordenar por markup de mayor a menor solo para tercero
            const markupA = calculateMarkup(Number(a.variation.priceCost), Number(a.variation.priceList))
            const markupB = calculateMarkup(Number(b.variation.priceCost), Number(b.variation.priceList))
            return markupB - markupA
        } else {
            // Ordenar por stock de mayor a menor
            const stockA = a.variation.stockQuantity ?? 0
            const stockB = b.variation.stockQuantity ?? 0
            return stockB - stockA
        }
    })

    return (
        <div className="flex-1 flex flex-col">
            {isTercero && (
                <div className="flex gap-4 mb-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg shadow w-1/2">
                    <div className="flex-1">
                        <label
                            htmlFor="markupMin"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Markup Min Tercero
                        </label>
                        <Input
                            id="markupMin"
                            type="number"
                            value={markupTerceroMin}
                            min={1}
                            onChange={(e) => setMarkupTerceroMin(parseFloat(e.target.value) || 0)}
                            className="w-full"
                            step="0.1"
                        />
                    </div>
                    <div className="flex-1">
                        <label
                            htmlFor="markupMax"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Markup Max Tercero
                        </label>
                        <Input
                            id="markupMax"
                            type="number"
                            value={markupTerceroMax}
                            onChange={(e) => setMarkupTerceroMax(parseFloat(e.target.value) || 0)}
                            className="w-full"
                            step="0.1"
                        />
                    </div>
                    <div className="flex-1">
                        <label
                            htmlFor="MarkupFlotMin"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Markup Min Flotante
                        </label>
                        <Input
                            id="MarkupFlotMin"
                            type="number"
                            min={1}
                            value={markupFlotanteMin}
                            onChange={(e) => setMarkupFlotanteMin(parseFloat(e.target.value) || 0)}
                            className="w-full"
                            step="0.1"
                        />
                    </div>
                </div>
            )}
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
                                    <div className="flex flex-col items-center gap-1">
                                        <span>{isAdmin ? "COSTO NETO" : "COSTO NETO + IVA"}</span>
                                        {/* {isTercero && (
                                            <button
                                                type="button"
                                                className={`text-xs px-2 py-1 rounded transition-colors border font-semibold ${
                                                    orderByMarkup
                                                        ? "bg-blue-600 text-white border-blue-700"
                                                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-400"
                                                }`}
                                                onClick={() => setOrderByMarkup((prev) => !prev)}
                                                title="Ordenar por markup"
                                            >
                                                Ordenar por markup
                                            </button>
                                        )} */}
                                    </div>
                                </TableHead>
                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                    {isTercero ? "PRECIO PLAZA SUGERIDO" : "PRECIO PLAZA"}
                                </TableHead>
                                {isAdmin && (
                                    <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                        STOCK CENTRAL
                                    </TableHead>
                                )}
                                {isTercero && (
                                    <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                        MARKUP
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
                            {sortedItems.map(({ product, variation, isFirst }, index) => {
                                // Stock de la tienda seleccionada
                                let stockTienda = 0
                                if (selectedStoreID) {
                                    const storeProduct = variation.StoreProducts?.find(
                                        (sp: any) => sp.storeID === selectedStoreID
                                    )
                                    stockTienda = storeProduct ? storeProduct.quantity : 0
                                }

                                const pedidoQuantity = pedido[variation.sku] || 0
                                let priceToShow = 0
                                let markupToShow = 0

                                if (isAdmin) {
                                    priceToShow = variation.priceCost ?? 0
                                    markupToShow = calculateMarkup(priceToShow, Number(variation.priceList))
                                } else if (isTercero) {
                                    const third = calculateThirdPartyPrice(Number(variation.priceList))
                                    if (third) {
                                        priceToShow = third.brutoCompra // lo que paga el tercero (con IVA)
                                        markupToShow = third.markupTercero
                                    } else {
                                        priceToShow = Number(variation.priceList)
                                        markupToShow = calculateMarkup(
                                            Number(variation.priceCost),
                                            Number(variation.priceList)
                                        )
                                    }
                                } else {
                                    priceToShow = Number(variation.priceList)
                                    markupToShow = calculateMarkup(
                                        Number(variation.priceCost),
                                        Number(variation.priceList)
                                    )
                                }

                                const subtotalVariation = pedidoQuantity * priceToShow

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
                                                    ${Math.round(priceToShow).toLocaleString("es-CO")}
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

                                        {/* Columna PRECIO LISTA solo para tercero */}
                                        <TableCell className="text-center py-2">
                                            <MotionItem key={`markup-${variation.variationID}`} delay={index + 2}>
                                                <span className="font-semibold text-sm">
                                                    ${toPrice(variation.priceList)}
                                                </span>
                                            </MotionItem>
                                        </TableCell>

                                        {/* Columna MARKUP solo para tercero */}
                                        {isTercero && (
                                            <TableCell className="text-center py-2">
                                                <MotionItem key={`markup-${variation.variationID}`} delay={index + 2}>
                                                    <span className="font-semibold text-xs">
                                                        {markupToShow.toFixed(2)}
                                                    </span>
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
