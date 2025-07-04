/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useState, useMemo, useEffect } from "react"
import { getAllProducts } from "@/actions/products/getAllProducts"
import { getAllStores } from "@/actions/stores/getAllStores"
import { IProduct } from "@/interfaces/products/IProduct"
import { IStore } from "@/interfaces/stores/IStore"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import TableSkeleton from "@/components/ListTable/TableSkeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createOrder } from "@/actions/orders/purchaseOrder"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

const ITEMS_PER_PAGE = 10

export default function PurchaseOrderPage() {
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [rawProducts, setRawProducts] = useState<IProduct[]>([])
    const [stores, setStores] = useState<IStore[]>([])
    const [selectedStoreID, setSelectedStoreID] = useState<string>("")
    const [pedido, setPedido] = useState<Record<string, number>>({})
    const [currentPage, setCurrentPage] = useState(1)

    const router = useRouter()

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
            const totalStockQuantity = product.ProductVariations.reduce((total, v) => total + v.stockQuantity, 0)

            product.ProductVariations.forEach((variation, index) => {
                flattened.push({
                    product,
                    variation,
                    isFirst: index === 0,
                    totalStock: totalStockQuantity,
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

    const subtotal = useMemo(
        () =>
            rawProducts.reduce((total, product) => {
                return (
                    total +
                    product.ProductVariations.reduce((sub, variation) => {
                        const qty = pedido[variation.sku] || 0
                        return sub + qty * variation.priceList
                    }, 0)
                )
            }, 0),
        [pedido, rawProducts]
    )

    const totalProductsInOrder = useMemo(() => {
        return Object.values(pedido).reduce((acc, curr) => acc + curr, 0)
    }, [pedido])

    const handleAgregarCalzados = () => {
        setPedido((prev) => {
            const nuevoPedido = { ...prev }
            rawProducts.forEach((product) => {
                product.ProductVariations.forEach((variation) => {
                    const sku = variation.sku
                    nuevoPedido[sku] = (nuevoPedido[sku] || 0) + 1
                })
            })
            return nuevoPedido
        })
    }

    const handleQuitarCalzados = () => {
        setPedido((prev) => {
            const nuevoPedido = { ...prev }
            rawProducts.forEach((product) => {
                product.ProductVariations.forEach((variation) => {
                    const sku = variation.sku
                    nuevoPedido[sku] = Math.max((nuevoPedido[sku] || 0) - 1, 0)
                })
            })
            return nuevoPedido
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
                <div className="flex lg:flex-row flex-col items-center gap-4">
                    <Input
                        type="text"
                        placeholder="Buscar producto aquí..."
                        className="flex-1 h-10 border dark:bg-gray-800 bg-slate-300 px-4 py-2 rounded"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="flex lg:flex-row flex-col lg:w-fit w-full gap-2">
                        <Button onClick={handleAgregarCalzados} className="h-10 bg-green-600">
                            Agregar calzados
                        </Button>
                        <Button variant="destructive" onClick={handleQuitarCalzados} className="h-10 bg-red-600">
                            Quitar calzados
                        </Button>
                    </div>
                </div>

                <div className="flex lg:flex-row flex-col items-center gap-4">
                    <span className="text-sm font-semibold whitespace-nowrap">Gestionando orden de compra para:</span>
                    <Select value={selectedStoreID} onValueChange={setSelectedStoreID}>
                        <SelectTrigger className="w-[250px] h-10">
                            <SelectValue placeholder="Seleccionar tienda" />
                        </SelectTrigger>
                        <SelectContent>
                            {stores.map((store) => (
                                <SelectItem key={store.storeID} value={store.storeID}>
                                    {store.name} - {store.city}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex lg:flex-row flex-col lg:justify-between items-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total productos en pedido:{" "}
                        <strong className="text-blue-600 dark:text-blue-400">{totalProductsInOrder}</strong>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Mostrando {startIndex + 1}-{Math.min(endIndex, flattenedProducts.length)} de{" "}
                        {flattenedProducts.length} elementos
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
                                            <TableHead className="text-center">COSTO</TableHead>
                                            <TableHead className="text-center">DISPONIBLE CENTRAL</TableHead>
                                            <TableHead className="text-center">DISPONIBLE TIENDA</TableHead>
                                            <TableHead className="text-center">PEDIDO</TableHead>
                                            <TableHead className="text-center">SUBTOTAL</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {currentItems.map(({ product, variation, isFirst, totalStock }) => {
                                            // Stock agregado = suma de StoreProducts en sucursales (no admin)
                                            const stockAgregado =
                                                variation.StoreProducts?.filter(
                                                    (sp: any) => !adminStoreIDs.includes(sp.storeID)
                                                ).reduce((sum: number, sp: any) => sum + sp.quantity, 0) ?? 0

                                            const pedidoQuantity = pedido[variation.sku] || 0
                                            const subtotalVariation = pedidoQuantity * (variation.priceList ?? 0)

                                            return (
                                                <TableRow
                                                    key={`${product.productID}-${variation.variationID}`}
                                                    className={`group ${
                                                        isFirst
                                                            ? "border-t-2 dark:border-t-gray-700 border-t-blue-300"
                                                            : "border-t"
                                                    } text-sm border-transparent dark:text-gray-300 text-gray-800 h-16`}
                                                >
                                                    {isFirst && (
                                                        <TableCell className="py-2 px-3 text-left w-1/4">
                                                            <div className="relative w-full flex items-center gap-3">
                                                                <img
                                                                    src={product.image}
                                                                    alt={product.name}
                                                                    className="w-12 h-12 object-cover rounded border"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <span className="font-medium text-sm block truncate">
                                                                        {product.name}
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

                                                    <TableCell className="text-center dark:hover:bg-gray-900 hover:bg-gray-100 py-2">
                                                        <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                            {variation.sku}
                                                        </span>
                                                    </TableCell>

                                                    <TableCell className="text-center dark:hover:bg-gray-900 hover:bg-gray-100 py-2">
                                                        <span className="font-medium">{variation.sizeNumber}</span>
                                                    </TableCell>

                                                    <TableCell className="text-center dark:hover:bg-gray-900 hover:bg-gray-100 py-2">
                                                        <span className="font-medium">
                                                            ${Number(variation.priceList).toLocaleString("es-CL")}
                                                        </span>
                                                    </TableCell>

                                                    <TableCell className="text-center dark:hover:bg-gray-900 hover:bg-gray-100 py-2">
                                                        <span
                                                            className={`font-bold px-2 py-1 rounded text-xs ${
                                                                variation.stockQuantity < 20
                                                                    ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                                                    : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                                            }`}
                                                        >
                                                            {variation.stockQuantity}
                                                        </span>
                                                    </TableCell>

                                                    <TableCell className="text-center dark:hover:bg-gray-900 hover:bg-gray-100 py-2">
                                                        <span className="font-medium text-blue-600 dark:text-blue-400">
                                                            {stockAgregado}
                                                        </span>
                                                    </TableCell>

                                                    <TableCell className="text-center dark:hover:bg-gray-900 hover:bg-gray-100 py-2">
                                                        <div className="flex justify-center">
                                                            <Input
                                                                type="number"
                                                                className="w-16 h-8 px-2 py-1 text-center text-xs"
                                                                value={pedidoQuantity || ""}
                                                                onChange={(e) =>
                                                                    setPedido((prev) => ({
                                                                        ...prev,
                                                                        [variation.sku]: parseInt(e.target.value) || 0,
                                                                    }))
                                                                }
                                                            />
                                                        </div>
                                                    </TableCell>

                                                    <TableCell className="text-center dark:hover:bg-gray-900 hover:bg-gray-100 py-2">
                                                        <span className="font-medium text-green-600 dark:text-green-400">
                                                            ${subtotalVariation.toLocaleString("es-CL")}
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
                            <div className="flex items-center justify-center gap-2 mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                                                className={currentPage === page ? "h-8 w-8 bg-slate-300" : "h-8 w-8"}
                                            >
                                                {page}
                                            </Button>
                                        )}
                                    </React.Fragment>
                                ))}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="h-8"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        {/* Order Summary and Actions */}
                        <div className="mt-6 space-y-4">
                            <div className="flex justify-center lg:justify-end">
                                <p className="text-lg font-bold">
                                    Subtotal general: ${subtotal.toLocaleString("es-CL")}
                                </p>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded w-full md:w-1/2 text-sm space-y-2">
                                    <p>
                                        <strong>Total de productos:</strong> {totalProductsInOrder}
                                    </p>
                                    <p>
                                        <strong>Total neto:</strong> ${subtotal.toLocaleString("es-CL")}
                                    </p>
                                    <p>
                                        <strong>IVA (19%):</strong> ${(subtotal * 0.19).toLocaleString("es-CL")}
                                    </p>
                                    <p>
                                        <strong>Total:</strong> ${(subtotal * 1.19).toLocaleString("es-CL")}
                                    </p>
                                </div>

                                <Button
                                    className="bg-green-600 lg:w-fit w-full hover:bg-green-700"
                                    onClick={async () => {
                                        if (!selectedStoreID) {
                                            alert("Selecciona una tienda antes de continuar.")
                                            return
                                        }

                                        //este userID es hardcodeado, se debe obtener del contexto de usuario o sesión
                                        const userID = "2f13abf6-bbb6-402b-a5b2-e368a89c79e9"

                                        const orderedProducts = Object.entries(pedido)
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            .filter(([_, qty]) => qty > 0)
                                            .map(([sku, quantityOrdered]) => {
                                                const variation = rawProducts
                                                    .flatMap((p) => p.ProductVariations)
                                                    .find((v) => v.sku === sku)

                                                return variation
                                                    ? {
                                                          variationID: variation.variationID,
                                                          quantityOrdered,
                                                      }
                                                    : null
                                            })
                                            .filter(Boolean) as {
                                            variationID: string
                                            quantityOrdered: number
                                        }[]

                                        if (orderedProducts.length === 0) {
                                            alert("Debes agregar al menos un producto con cantidad mayor a 0.")
                                            return
                                        }

                                        const res = await createOrder({
                                            storeID: selectedStoreID,
                                            userID,
                                            products: orderedProducts,
                                        })

                                        if (res.success) {
                                            router.push("/home/invoices")
                                        } else {
                                            alert(res.error)
                                        }
                                    }}
                                >
                                    ➡ Generar orden de compra
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </main>
    )
}
