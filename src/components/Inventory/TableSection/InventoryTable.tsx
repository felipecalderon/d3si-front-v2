/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

interface InventoryTableProps {
    currentItems: Array<{
        product: IProduct
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    const isEditable = user?.role !== Role.Vendedor

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
                                    MARCA
                                </TableHead>
                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                    CATEGORÍA
                                </TableHead>
                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                    TALLA
                                </TableHead>
                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                    PRECIO COSTO
                                </TableHead>
                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                    PRECIO PLAZA
                                </TableHead>
                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                    OFERTAS
                                </TableHead>
                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                    STOCK CENTRAL
                                </TableHead>
                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                    STOCK AGREGADO
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {currentItems.map(({ product, variation, isFirst, totalStock }, index) => {
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
                                            <TableCell className="py-2 px-3 text-left w-1/4">
                                                <div className="relative w-full flex items-center gap-3">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="absolute top-0 left-0 z-10 h-8 w-8 p-0 dark:hover:bg-gray-900 hover:bg-gray-100"
                                                            >
                                                                <MoreVertical className="w-4 h-4 text-gray-600" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="start">
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    setAddSizeModalProductID(product.productID)
                                                                }
                                                            >
                                                                Agregar talla
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDeleteProduct(product)}
                                                                className="text-red-600"
                                                            >
                                                                Eliminar producto
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>

                                                    <AddSizeModal
                                                        productID={product.productID}
                                                        name={product.name}
                                                        image={product.image}
                                                        genre={product.genre}
                                                        open={addSizeModalProductID === product.productID}
                                                        onOpenChange={(open) => {
                                                            if (!open) setAddSizeModalProductID(null)
                                                        }}
                                                        onAddSize={(newSize) => {
                                                            setRawProducts(
                                                                rawProducts.map((p) =>
                                                                    p.productID === product.productID
                                                                        ? {
                                                                              ...p,
                                                                              ProductVariations: [
                                                                                  ...p.ProductVariations,
                                                                                  newSize,
                                                                              ],
                                                                          }
                                                                        : p
                                                                )
                                                            )
                                                        }}
                                                    />
                                                    {product.image ? (
                                                        <Image
                                                            src={product.image}
                                                            alt={product.name}
                                                            width={200}
                                                            height={200}
                                                            className="w-12 h-12 object-cover rounded border"
                                                        />
                                                    ) : (
                                                        "--"
                                                    )}

                                                    <div className="flex-1 min-w-0">
                                                        <span className="font-medium text-sm block truncate">
                                                            {product.name}
                                                        </span>
                                                        {/* SKU debajo de la imagen */}
                                                        <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mt-1 inline-block">
                                                            {variation.sku}
                                                        </span>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full font-medium">
                                                                Stock: {totalStock}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        )}
                                        {!isFirst && (
                                            <TableCell className="text-center dark:hover:bg-gray-900 hover:bg-gray-100 py-2"></TableCell>
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
                                                <MotionItem
                                                    key={`${product.productID}-${variation.variationID}`}
                                                    delay={index + 3}
                                                >
                                                    <span className="font-medium">{variation.sizeNumber}</span>
                                                </MotionItem>
                                            )}
                                        </TableCell>

                                        {/* Columna PRECIO COSTO */}
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
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onBlur={() => handleSaveEdit(product, variation.variationID)}
                                                        className="w-20 h-8 px-2 py-1 text-center text-xs"
                                                        autoFocus
                                                    />
                                                </div>
                                            ) : (
                                                <span className="font-semibold text-sm">
                                                    ${Number(variation.priceCost).toLocaleString("es-CL")}
                                                </span>
                                            )}
                                        </TableCell>

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
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onBlur={() => handleSaveEdit(product, variation.variationID)}
                                                        className="w-20 h-8 px-2 py-1 text-center text-xs"
                                                        autoFocus
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="font-semibold text-sm">
                                                        ${Number(variation.priceList).toLocaleString("es-CL")}
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
                                        <TableCell className="text-center dark:hover:bg-gray-900 hover:bg-gray-100 py-2">
                                            {/* Aquí puedes mostrar el precio de oferta, porcentaje, o un botón, según tu lógica */}
                                            {variation.offerPrice ? (
                                                <span className="font-semibold text-green-600">
                                                    ${Number(variation.offerPrice).toLocaleString("es-CL")}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </TableCell>
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
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onBlur={() => handleSaveEdit(product, variation.variationID)}
                                                        className="w-20 h-8 px-2 py-1 text-center text-xs"
                                                        autoFocus
                                                    />
                                                </div>
                                            ) : (
                                                <Badge
                                                    variant={variation.stockQuantity < 20 ? "destructive" : "default"}
                                                    className="font-bold text-sm"
                                                >
                                                    {variation.stockQuantity}
                                                </Badge>
                                            )}
                                        </TableCell>

                                        <TableCell className="text-center dark:hover:bg-gray-900 hover:bg-gray-100 py-2">
                                            <MotionItem
                                                key={`${product.productID}-${variation.variationID}`}
                                                delay={index + 3}
                                            >
                                                <span className="font-medium text-blue-600 dark:text-blue-400">
                                                    {stockAgregado}
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
