/* eslint-disable @next/next/no-img-element */
"use client"
import React, { useState, useMemo, useEffect } from "react"
import { getAllProducts } from "@/actions/products/getAllProducts"
import { createMassiveProducts } from "@/actions/products/createMassiveProducts"
import { getAllStores } from "@/actions/stores/getAllStores"
import { IProduct } from "@/interfaces/products/IProduct"
import { IStore } from "@/interfaces/stores/IStore"
import InventoryActions from "@/components/Inventory/InventoryActions"
import { MoreVertical, ChevronLeft, ChevronRight } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { AddSizeModal } from "@/components/Modals/AddSizeModal"
import { deleteProduct } from "@/actions/products/deleteProduct"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import TableSkeleton from "@/components/ListTable/TableSkeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const ITEMS_PER_PAGE = 10

export default function InventoryPage() {
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [rawProducts, setRawProducts] = useState<IProduct[]>([])
    const [stores, setStores] = useState<IStore[]>([])
    const [addSizeModalProductID, setAddSizeModalProductID] = useState<string | null>(null)
    const [editingField, setEditingField] = useState<{
        sku: string
        field: "priceCost" | "priceList" | "stockQuantity" | "sizeNumber"
    } | null>(null)
    const [editValue, setEditValue] = useState<string>("")
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        async function fetchData() {
            const [productsData, storesData] = await Promise.all([getAllProducts(), getAllStores()])
            setRawProducts(productsData)
            setStores(storesData)
            setIsLoading(false)
        }
        fetchData()
    }, [])

    const adminStoreIDs = useMemo(() => {
        return stores.filter((s) => s.isAdminStore).map((s) => s.storeID)
    }, [stores])

    const totalStockCentral = useMemo(
        () =>
            rawProducts.reduce(
                (total, product) =>
                    total + product.ProductVariations.reduce((sum, variation) => sum + variation.stockQuantity, 0),
                0
            ),
        [rawProducts]
    )

    const orderedProducts = useMemo(() => {
        if (!search.trim()) return rawProducts
        const lower = search.toLowerCase()
        return [
            ...rawProducts.filter(
                (product) =>
                    product.name.toLowerCase().includes(lower) ||
                    product.ProductVariations.some((v) => v.sku?.toLowerCase().includes(lower))
            ),
            ...rawProducts.filter(
                (product) =>
                    !(
                        product.name.toLowerCase().includes(lower) ||
                        product.ProductVariations.some((v) => v.sku?.toLowerCase().includes(lower))
                    )
            ),
        ]
    }, [search, rawProducts])

    // Flatten products for pagination
    const flattenedProducts = useMemo(() => {
        const flattened: Array<{ product: IProduct; variation: any; isFirst: boolean; totalStock: number }> = []
        
        orderedProducts.forEach((product) => {
            const totalStockQuantity = product.ProductVariations.reduce(
                (total, v) => total + v.stockQuantity,
                0
            )
            
            product.ProductVariations.forEach((variation, index) => {
                flattened.push({
                    product,
                    variation,
                    isFirst: index === 0,
                    totalStock: totalStockQuantity
                })
            })
        })
        
        return flattened
    }, [orderedProducts])

    // Pagination logic
    const totalPages = Math.ceil(flattenedProducts.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentItems = flattenedProducts.slice(startIndex, endIndex)

    // Reset to first page when search changes
    useEffect(() => {
        setCurrentPage(1)
    }, [search])

    function handleDeleteProduct(product: IProduct) {
        const confirm = window.confirm(
            `¿Estás seguro de que deseas eliminar el producto "${product.name}"? Esta acción no se puede revertir.`
        )
        if (!confirm) return

        toast.promise(deleteProduct(product.productID), {
            loading: "Eliminando producto...",
            success: () => {
                setRawProducts((prev) => prev.filter((p) => p.productID !== product.productID))
                return "Producto eliminado con éxito"
            },
            error: "Hubo un error al eliminar el producto",
        })
    }

    async function handleSaveEdit(product: IProduct, variationID: string) {
        const variation = product.ProductVariations.find((v) => v.variationID === variationID)
        if (!variation) return

        const updated = {
            name: product.name,
            image: product.image,
            genre: product.genre,
            sizes: [
                {
                    sku: variation.sku,
                    sizeNumber: editingField!.field === "sizeNumber" ? editValue : variation.sizeNumber,
                    priceList: editingField!.field === "priceList" ? parseFloat(editValue) : variation.priceList,
                    priceCost: editingField!.field === "priceCost" ? parseFloat(editValue) : variation.priceCost,
                    stockQuantity:
                        editingField!.field === "stockQuantity" ? parseFloat(editValue) : variation.stockQuantity,
                },
            ],
        }

        toast.promise(createMassiveProducts({ products: [updated] }), {
            loading: "Actualizando producto...",
            success: () => {
                setRawProducts((prev) =>
                    prev.map((p) =>
                        p.productID === product.productID
                            ? {
                                  ...p,
                                  ProductVariations: p.ProductVariations.map((v) =>
                                      v.variationID === variationID
                                          ? {
                                                ...v,
                                                [editingField!.field]:
                                                    editingField!.field === "sizeNumber"
                                                        ? editValue
                                                        : parseFloat(editValue),
                                            }
                                          : v
                                  ),
                              }
                            : p
                    )
                )
                setEditingField(null)
                return "Campo actualizado"
            },
            error: "Error al actualizar",
        })
    }

    const getVisiblePages = () => {
        const pages = []
        const maxVisiblePages = 5
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, "...", totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
            } else {
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
            }
        }
        
        return pages
    }

    return (
        <main className="p-6 flex-1 flex flex-col h-screen">
            {/* Header Section */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <Input
                        type="text"
                        placeholder="Buscar producto aquí..."
                        className="flex-1 h-10 border dark:bg-gray-800 bg-slate-300 px-4 py-2 rounded"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="h-10">
                        <InventoryActions products={rawProducts} />
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Hay un total de <strong className="text-blue-600 dark:text-blue-400">{totalStockCentral}</strong> productos en stock central.
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Mostrando {startIndex + 1}-{Math.min(endIndex, flattenedProducts.length)} de {flattenedProducts.length} elementos
                    </p>
                </div>
            </div>

            {/* Table Section */}
            <div className="flex-1 flex flex-col">
                {isLoading ? (
                    <TableSkeleton />
                ) : (
                    <>
                        <div className="flex-1 dark:bg-slate-900 bg-white shadow rounded overflow-hidden">
                            <div className="overflow-x-auto h-full">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-gray-50 dark:bg-slate-800">
                                        <TableRow>
                                            <TableHead className="w-1/4">Producto</TableHead>
                                            <TableHead className="text-center">CÓDIGO EAN</TableHead>
                                            <TableHead className="text-center">TALLA</TableHead>
                                            <TableHead className="text-center">PRECIO COSTO</TableHead>
                                            <TableHead className="text-center">PRECIO PLAZA</TableHead>
                                            <TableHead className="text-center">STOCK CENTRAL</TableHead>
                                            <TableHead className="text-center">STOCK AGREGADO</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {currentItems.map(({ product, variation, isFirst, totalStock }, index) => {
                                            // Stock agregado = suma de StoreProducts en sucursales (no admin)
                                            const stockAgregado =
                                                variation.StoreProducts?.filter(
                                                    (sp: any) => !adminStoreIDs.includes(sp.storeID)
                                                ).reduce((sum: number, sp: any) => sum + sp.quantity, 0) ?? 0

                                            return (
                                                <TableRow
                                                    key={`${product.productID}-${variation.variationID}`}
                                                    className={`group ${
                                                        isFirst
                                                            ? "border-t-2 dark:border-t-gray-700 border-t-blue-300"
                                                            : "border-t"
                                                    } text-sm border-gray-200 dark:text-gray-300 text-gray-800 h-16`}
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
                                                                        setRawProducts((prev) =>
                                                                            prev.map((p) =>
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

                                                                <img
                                                                    src={product.image}
                                                                    alt={product.name}
                                                                    className="w-12 h-12 object-cover rounded border"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <span className="font-medium text-sm block truncate">{product.name}</span>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full font-medium">
                                                                            Stock: {totalStock}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    )}
                                                    <TableCell className="text-center dark:hover:bg-gray-900 hover:bg-gray-100 py-2">
                                                        <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                            {variation.sku}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell
                                                        className="text-center dark:hover:bg-gray-900 hover:bg-gray-100 cursor-pointer py-2"
                                                        onClick={() => {
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
                                                                    onBlur={() =>
                                                                        handleSaveEdit(product, variation.variationID)
                                                                    }
                                                                    className="w-16 h-8 px-2 py-1 text-center text-xs"
                                                                    autoFocus
                                                                />
                                                            </div>
                                                        ) : (
                                                            <span className="font-medium">{variation.sizeNumber}</span>
                                                        )}
                                                    </TableCell>

                                                    {(
                                                        ["priceCost", "priceList", "stockQuantity"] as Array<
                                                            "priceCost" | "priceList" | "stockQuantity"
                                                        >
                                                    ).map((field) => (
                                                        <TableCell
                                                            key={field}
                                                            className="text-center dark:hover:bg-gray-900 hover:bg-gray-100 cursor-pointer py-2"
                                                            onClick={() => {
                                                                setEditingField({ sku: variation.sku, field })
                                                                setEditValue(String(variation[field]))
                                                            }}
                                                        >
                                                            {editingField?.sku === variation.sku &&
                                                            editingField?.field === field ? (
                                                                <div className="flex justify-center">
                                                                    <Input
                                                                        value={editValue}
                                                                        onChange={(e) => setEditValue(e.target.value)}
                                                                        onBlur={() =>
                                                                            handleSaveEdit(product, variation.variationID)
                                                                        }
                                                                        className="w-20 h-8 px-2 py-1 text-center text-xs"
                                                                        autoFocus
                                                                    />
                                                                </div>
                                                            ) : field === "stockQuantity" ? (
                                                                <span
                                                                    className={`font-bold px-2 py-1 rounded text-xs ${
                                                                        variation.stockQuantity < 20
                                                                            ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                                                            : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                                                    }`}
                                                                >
                                                                    {variation.stockQuantity}
                                                                </span>
                                                            ) : (
                                                                <span className="font-medium">
                                                                    ${Number(variation[field]).toLocaleString("es-CL")}
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                    ))}

                                                    <TableCell className="text-center dark:hover:bg-gray-900 hover:bg-gray-100 py-2">
                                                        <span className="font-medium text-blue-600 dark:text-blue-400">
                                                            {stockAgregado}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-4 pb-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="h-8"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>

                                {getVisiblePages().map((page, index) => (
                                    <React.Fragment key={index}>
                                        {page === "..." ? (
                                            <span className="px-2 text-gray-500">...</span>
                                        ) : (
                                            <Button
                                                variant={currentPage === page ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setCurrentPage(page as number)}
                                                className="h-8 w-8"
                                            >
                                                {page}
                                            </Button>
                                        )}
                                    </React.Fragment>
                                ))}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="h-8"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    )
}