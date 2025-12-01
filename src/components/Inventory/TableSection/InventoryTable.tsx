"use client"

import type React from "react"
import { MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { AddSizeModal } from "@/components/Modals/AddSizeModal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MotionItem } from "@/components/Animations/motionItem"
import type { IProduct } from "@/interfaces/products/IProduct"
import { ICategory } from "@/interfaces/categories/ICategory"
import { useAuth } from "@/stores/user.store"
import { Role } from "@/lib/userRoles"
import { inventoryStore } from "@/stores/inventory.store"
import Image from "next/image"
import useQueryParams from "@/hooks/useQueryParams"
import { getProductById } from "@/actions/products/getProductById"
import { toPrice } from "@/utils/priceFormat"
import { PrintbarcodeModal } from "./PrintBarcodeModal"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface InventoryTableProps {
    currentItems: Array<{
        product: IProduct
        variation: any
        isFirst: boolean
        totalStock: number
    }>
    handleSaveEdit: (product: IProduct, variationID?: string) => void
    handleDeleteProduct: (product: IProduct) => void
    adminStoreIDs: string[]
    categories: ICategory[]
}

const calculateMarkup = (priceCost: number, priceList: number): string => {
    if (priceCost === 0) return "N/A"
    const markup = priceList / priceCost
    return markup.toFixed(2)
}

const getCategoryFullNameFromProduct = (product: IProduct, categories: ICategory[]): string => {
    const cat = product.Category
    if (!cat) return "-"
    if (!cat.parentID) return cat.name
    const parent = categories.find((c) => c.categoryID === cat.parentID)
    return parent ? `${parent.name} / ${cat.name}` : cat.name
}

export function InventoryTable({
    currentItems,
    handleSaveEdit,
    handleDeleteProduct,
    adminStoreIDs,
    categories,
}: InventoryTableProps) {
    const { user } = useAuth()
    const {
        rawProducts,
        editingField,
        setEditingField,
        editValue,
        setEditValue,
        setRawProducts,
        setAddSizeModalProductID,
        addSizeModalProductID,
    } = inventoryStore()
    const { searchParams } = useQueryParams()
    const storeID = searchParams.get("storeID")
    const products = currentItems.map((p) => p.product)
    const [openSku, setOpenSku] = useState<string | null>(null)

    const printBarcodeModal = (sku: string | null) => {
        setOpenSku(sku)
    }
    const isEditable = user?.role !== Role.Vendedor && user?.role !== Role.Tercero

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex-1 dark:bg-slate-900 bg-white shadow rounded-t-none overflow-hidden">
                <div className="overflow-x-auto h-full">
                    <Table>
                        <TableHeader className="sticky top-0 bg-gray-50 dark:bg-slate-800">
                            <TableRow>
                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                    PRODUCTO
                                </TableHead>
                                <TableHead className="whitespace text-center font-semibold text-gray-700 dark:text-gray-200">
                                    SKU
                                </TableHead>
                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                    MARCA
                                </TableHead>
                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                    CATEGORÍA
                                </TableHead>
                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                    TALLA
                                </TableHead>
                                {/* PRECIO COSTO se muestra solo si es admin */}
                                {user?.role === Role.Admin && (
                                    <TableHead className="whitespace text-center font-semibold text-gray-700 dark:text-gray-200">
                                        COSTO NETO
                                    </TableHead>
                                )}
                                <TableHead className="whitespace text-center font-semibold text-gray-700 dark:text-gray-200">
                                    PRECIO PLAZA
                                </TableHead>
                                <TableHead className="whitespace text-center font-semibold text-gray-700 dark:text-gray-200">
                                    {user?.role === Role.Admin ? "STOCK CENTRAL" : "STOCK TIENDA"}
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {currentItems.map(({ product, variation, isFirst, totalStock }, index) => {
                                const productData = getProductById([product], storeID!, variation.sku)
                                // Stock agregado = suma de StoreProducts en sucursales (no admin)
                                const stockAgregado =
                                    variation.StoreProducts?.filter(
                                        (sp: any) => !adminStoreIDs.includes(sp.storeID)
                                    ).reduce((sum: number, sp: any) => sum + sp.quantity, 0) ?? 0
                                const profitMargin =
                                    variation.priceList > 0
                                        ? ((variation.priceList - variation.priceCost) / variation.priceList) * 100
                                        : 0
                                return (
                                    <TableRow
                                        key={`${product.productID}-${variation.variationID}`}
                                        className={`group hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-200 ${
                                            isFirst
                                                ? "border-t-2 border-t-slate-200 dark:border-t-slate-400"
                                                : "border-t border-gray-100 dark:border-gray-700"
                                        } text-sm dark:text-gray-300 text-gray-800 h-16`}
                                    >
                                        {isFirst && (
                                            <TableCell
                                                className="py-2 px-3 text-left w-1/4"
                                                rowSpan={
                                                    variation.rowSpan ||
                                                    (
                                                        currentItems.find(
                                                            (i) =>
                                                                i.product.productID === product.productID && i.isFirst
                                                        ) as any
                                                    )?.rowSpan ||
                                                    product.ProductVariations.length
                                                }
                                            >
                                                <MotionItem key={`product-${product.productID}`} delay={index + 2}>
                                                    <div className="flex flex-col relative w-full items-center gap-4">
                                                        <div className="relative">
                                                            <div className="relative group transition-transform transform hover:scale-105">
                                                                <Image
                                                                    src={product.image || "/placeholder.svg"}
                                                                    alt={product.name}
                                                                    width={200}
                                                                    height={200}
                                                                    className="w-48 h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                                                                    style={{ objectFit: "cover" }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-base text-center">
                                                                {product.name}
                                                            </p>
                                                            <div className="flex justify-center gap-2 mt-2">
                                                                <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full font-medium">
                                                                    {product.ProductVariations.reduce(
                                                                        (prev, variation) => {
                                                                            return prev + variation.stockQuantity
                                                                        },
                                                                        0
                                                                    )}{" "}
                                                                    productos
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </MotionItem>
                                            </TableCell>
                                        )}
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <TableCell
                                                    onClick={() =>
                                                        printBarcodeModal(
                                                            openSku === variation.sku ? null : variation.sku
                                                        )
                                                    }
                                                    className="px-3 py-1 text-xs font-medium cursor-pointer"
                                                >
                                                    {variation.sku}
                                                </TableCell>
                                            </TooltipTrigger>
                                            <TooltipContent side="left" sideOffset={-10}>
                                                <p>Imprimir Etiqueta</p>
                                            </TooltipContent>
                                        </Tooltip>

                                        {productData && (
                                            <PrintbarcodeModal
                                                // El modal está abierto SÓLO si el SKU de la variación actual coincide con el estado
                                                isOpen={openSku === variation.sku}
                                                // Para cerrar el modal, simplemente pasamos 'null'
                                                onOpenChange={(newOpenState) =>
                                                    printBarcodeModal(newOpenState ? variation.sku : null)
                                                }
                                                value={productData}
                                            />
                                        )}

                                        {/* Columna MARCA */}
                                        <TableCell
                                            className={`text-center py-2 ${
                                                isEditable
                                                    ? "cursor-pointer dark:hover:bg-gray-900 hover:bg-gray-100"
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                if (!isEditable) return
                                                setEditingField({ sku: product.productID, field: "brand" })
                                                setEditValue(product.brand || "")
                                            }}
                                        >
                                            {editingField?.sku === product.productID &&
                                            editingField?.field === "brand" ? (
                                                <div className="flex justify-center">
                                                    <Input
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onBlur={() => handleSaveEdit(product)}
                                                        className="w-24 h-8 px-2 py-1 text-center text-xs"
                                                        autoFocus
                                                    />
                                                </div>
                                            ) : (
                                                <MotionItem key={`brand-${product.productID}`} delay={index + 5}>
                                                    <span className="font-medium">{product.brand}</span>
                                                </MotionItem>
                                            )}
                                        </TableCell>

                                        {/* Columna CATEGORIA */}
                                        <TableCell className="text-center dark:hover:bg-gray-900 hover:bg-gray-100 py-2">
                                            {getCategoryFullNameFromProduct(product, categories)}
                                        </TableCell>

                                        {/* Columna TALLA */}
                                        <TableCell
                                            className={`text-center py-2 ${
                                                isEditable
                                                    ? "cursor-pointer dark:hover:bg-gray-900 hover:bg-gray-100"
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                if (!isEditable) return
                                                setEditingField({ sku: variation.sku, field: "sizeNumber" })
                                                setEditValue(variation.sizeNumber)
                                            }}
                                        >
                                            {editingField?.sku === variation.sku &&
                                            editingField?.field === "sizeNumber" ? (
                                                <div className="flex justify-center">
                                                    <Input
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onBlur={() => handleSaveEdit(product, variation.variationID)}
                                                        className="w-16 h-8 px-2 py-1 text-center text-xs"
                                                        autoFocus
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-1">
                                                    <MotionItem
                                                        key={`${product.productID}-${variation.variationID}`}
                                                        delay={index + 3}
                                                    >
                                                        <span className="font-medium">{variation.sizeNumber}</span>
                                                    </MotionItem>
                                                </div>
                                            )}
                                        </TableCell>

                                        {/* Columna PRECIO COSTO se muestra solo si es admin */}
                                        {user?.role === Role.Admin && (
                                            <TableCell
                                                className={`w-32 text-center py-3 transition-colors ${
                                                    isEditable
                                                        ? "cursor-pointer dark:hover:bg-gray-800 hover:bg-gray-50"
                                                        : ""
                                                }`}
                                                onClick={() => {
                                                    if (!isEditable) return
                                                    setEditingField({ sku: variation.sku, field: "priceCost" })
                                                    setEditValue(String(variation.priceCost))
                                                }}
                                            >
                                                {editingField?.sku === variation.sku &&
                                                editingField?.field === "priceCost" ? (
                                                    <div className="flex justify-center">
                                                        <Input
                                                            type="number"
                                                            value={editValue}
                                                            onWheel={(e) => {
                                                                e.currentTarget.blur()
                                                            }}
                                                            onChange={(e) => setEditValue(e.target.value)}
                                                            onBlur={() =>
                                                                handleSaveEdit(product, variation.variationID)
                                                            }
                                                            className="w-20 h-8 px-2 py-1 text-center text-xs"
                                                            autoFocus
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className="font-semibold text-sm">
                                                        ${toPrice(variation.priceCost)}
                                                    </span>
                                                )}
                                            </TableCell>
                                        )}

                                        {/* Columna PRECIO PLAZA */}
                                        <TableCell
                                            className={`w-32 text-center py-3 transition-colors ${
                                                isEditable
                                                    ? "cursor-pointer dark:hover:bg-gray-800 hover:bg-gray-50"
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                if (!isEditable) return
                                                setEditingField({ sku: variation.sku, field: "priceList" })
                                                setEditValue(String(variation.priceList))
                                            }}
                                        >
                                            {editingField?.sku === variation.sku &&
                                            editingField?.field === "priceList" ? (
                                                <div className="flex justify-center">
                                                    <Input
                                                        type="number"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onBlur={() => handleSaveEdit(product, variation.variationID)}
                                                        onWheel={(e) => {
                                                            e.currentTarget.blur()
                                                        }}
                                                        className="w-20 h-8 px-2 py-1 text-center text-xs"
                                                        autoFocus
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="font-semibold text-sm">
                                                        ${toPrice(variation.priceList)}
                                                    </span>
                                                    <span
                                                        className={`text-xs ${
                                                            profitMargin > 30
                                                                ? "text-green-600"
                                                                : profitMargin > 15
                                                                ? "text-yellow-600"
                                                                : "text-red-600"
                                                        }`}
                                                    >
                                                        Markup:{" "}
                                                        {calculateMarkup(variation.priceCost, variation.priceList)}
                                                    </span>
                                                </div>
                                            )}
                                        </TableCell>
                                        {/* OFERTAS */}
                                        {/* <TableCell className="text-center dark:hover:bg-gray-900 hover:bg-gray-100 py-2">
                                            {variation.offerPrice ? (
                                                <span className="font-semibold text-green-600">
                                                    ${formatCurrency(variation.offerPrice)}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </TableCell> */}
                                        {/* Columna STOCK CENTRAL */}
                                        <TableCell
                                            className={`w-32 text-center py-3 transition-colors ${
                                                isEditable
                                                    ? "cursor-pointer dark:hover:bg-gray-800 hover:bg-gray-50"
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                if (!isEditable) return
                                                setEditingField({ sku: variation.sku, field: "stockQuantity" })
                                                setEditValue(String(variation.stockQuantity))
                                            }}
                                        >
                                            {editingField?.sku === variation.sku &&
                                            editingField?.field === "stockQuantity" ? (
                                                <div className="flex justify-center">
                                                    <Input
                                                        type="number"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onBlur={() => handleSaveEdit(product, variation.variationID)}
                                                        onWheel={(e) => {
                                                            e.currentTarget.blur()
                                                        }}
                                                        className="w-20 h-8 px-2 py-1 text-center text-xs"
                                                        autoFocus
                                                    />
                                                </div>
                                            ) : (
                                                <Badge
                                                    variant={variation.stockQuantity < 20 ? "destructive" : "default"}
                                                    className="font-bold text-sm"
                                                >
                                                    {user?.role === Role.Admin
                                                        ? productData?.stockQuantity
                                                        : productData?.quantity}
                                                </Badge>
                                            )}
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
