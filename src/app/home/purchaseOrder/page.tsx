/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useState, useMemo, useEffect } from "react"
import { getAllProducts } from "@/actions/products/getAllProducts"
import { getAllCategories } from "@/actions/categories/getAllCategories"
import { getAllStores } from "@/actions/stores/getAllStores"
import type { IProduct } from "@/interfaces/products/IProduct"
import type { ICategory } from "@/interfaces/categories/ICategory"
import type { IStore } from "@/interfaces/stores/IStore"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import TableSkeleton from "@/components/ListTable/TableSkeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { createOrder } from "@/actions/orders/purchaseOrder"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Plus, Minus, ShoppingCart } from "lucide-react"
import { MotionItem } from "@/components/Animations/motionItem"
import { ListFilters } from "@/components/ListTable/ListFilters"
import { useProductFilters } from "@/hooks/use-product-filters"

const ITEMS_PER_PAGE = 10

export default function PurchaseOrderPage() {
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [rawProducts, setRawProducts] = useState<IProduct[]>([])
    const [categories, setCategories] = useState<ICategory[]>([])
    const [stores, setStores] = useState<IStore[]>([])
    const [selectedStoreID, setSelectedStoreID] = useState<string>("")
    const [pedido, setPedido] = useState<Record<string, number>>({})
    const [currentPage, setCurrentPage] = useState(1)

    const router = useRouter()

    // Hook de filtros
    const {
        selectedFilter,
        sortDirection,
        selectedCategory,
        selectedGenre,
        filteredAndSortedProducts,
        setSelectedFilter,
        setSortDirection,
        setSelectedCategory,
        setSelectedGenre,
        clearFilters,
    } = useProductFilters(rawProducts)

    useEffect(() => {
        async function fetchData() {
            const [productsData, categoriesData, storesData] = await Promise.all([
                getAllProducts(),
                getAllCategories(),
                getAllStores(),
            ])
            setRawProducts(productsData)
            setCategories(categoriesData)
            setStores(storesData)
            setIsLoading(false)
        }
        fetchData()
    }, [])

    const adminStoreIDs = useMemo(() => {
        return stores.filter((s) => s.isAdminStore).map((s) => s.storeID)
    }, [stores])

    // Aplicar búsqueda a los productos ya filtrados
    const searchedProducts = useMemo(() => {
        if (!search.trim()) return filteredAndSortedProducts
        const lower = search.toLowerCase()
        return filteredAndSortedProducts.filter(
            (product) =>
                product.name.toLowerCase().includes(lower) ||
                product.ProductVariations.some((v) => v.sku?.toLowerCase().includes(lower))
        )
    }, [search, filteredAndSortedProducts])

    // Flatten products for pagination
    const flattenedProducts = useMemo(() => {
        const flattened: Array<{ product: IProduct; variation: any; isFirst: boolean; totalStock: number }> = []

        searchedProducts.forEach((product) => {
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
    }, [searchedProducts])

    // Pagination logic
    const totalPages = Math.ceil(flattenedProducts.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentItems = flattenedProducts.slice(startIndex, endIndex)

    // Reset to first page when search or filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [search, selectedFilter, sortDirection, selectedCategory, selectedGenre])

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
            searchedProducts.forEach((product) => {
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
            searchedProducts.forEach((product) => {
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
    // Calcular productos únicos en la página actual
    const uniqueProductsInCurrentPage = useMemo(() => {
        const uniqueProductIds = new Set()
        currentItems.forEach(({ product }) => {
            uniqueProductIds.add(product.productID)
        })
        return uniqueProductIds.size
    }, [currentItems])

    return (
        <main className="p-6 flex-1 flex flex-col h-screen">
            {/* Header Section */}
            <MotionItem delay={0}>
                <div className="flex flex-col gap-4 mb-6">
                    <div className="flex lg:flex-row flex-col items-center gap-4">
                        <Input
                            type="text"
                            placeholder="Buscar producto o código EAN..."
                            className="flex-1 h-11 border-2 dark:bg-gray-800 bg-white px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <Button onClick={handleAgregarCalzados} className="h-11 bg-green-600 hover:bg-green-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Agregar
                            </Button>
                            <Button variant="destructive" onClick={handleQuitarCalzados} className="h-11">
                                <Minus className="w-4 h-4 mr-2" />
                                Quitar
                            </Button>
                        </div>
                    </div>
                    {/* Filtros */}
                    <ListFilters
                        products={rawProducts}
                        categories={categories}
                        selectedFilter={selectedFilter}
                        sortDirection={sortDirection}
                        selectedCategory={selectedCategory}
                        selectedGenre={selectedGenre}
                        onFilterChange={setSelectedFilter}
                        onSortDirectionChange={setSortDirection}
                        onCategoryChange={setSelectedCategory}
                        onGenreChange={setSelectedGenre}
                        onClearFilters={clearFilters}
                    />
                    <div className="flex lg:flex-row flex-col items-center gap-4">
                        <span className="text-sm font-semibold whitespace-nowrap">Orden de compra para:</span>
                        <Select value={selectedStoreID} onValueChange={setSelectedStoreID}>
                            <SelectTrigger className="w-[300px] h-11 border-2">
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

                    <div className="flex justify-between lg:mt-0 mt-6 lg:flex-row flex-col lg:items-center">
                        <div className="flex items-center gap-4">
                            <Badge variant="secondary" className="text-sm px-3 py-1">
                                <ShoppingCart className="w-4 h-4 mr-1" />
                                <span className="text-blue-600 dark:text-blue-400 font-bold">
                                    {totalProductsInOrder}
                                </span>
                                <span className="ml-1">productos en pedido</span>
                            </Badge>
                            <Badge variant="outline" className="text-sm px-3 py-1">
                                <span className="text-gray-600 dark:text-gray-400">Mostrando:</span>
                                <span className="ml-1 font-bold text-blue-600 dark:text-blue-400">
                                    {uniqueProductsInCurrentPage}
                                </span>
                                <span className="ml-1">de {searchedProducts.length} productos</span>
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Página {currentPage} de {totalPages} - {searchedProducts.length} productos (
                            {flattenedProducts.length} variaciones)
                        </p>
                    </div>
                </div>
            </MotionItem>

            {/* Table Section */}
            <div className="flex-1 flex flex-col">
                {isLoading ? (
                    <TableSkeleton />
                ) : (
                    <>
                        <MotionItem delay={1} className="flex-1">
                            <div className="flex-1 dark:bg-slate-900 bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                <div className="overflow-x-auto h-full">
                                    <Table>
                                        <TableHeader className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700">
                                            <TableRow>
                                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                                    Producto
                                                </TableHead>
                                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                                    SKU
                                                </TableHead>
                                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                                    TALLA
                                                </TableHead>
                                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                                    COSTO
                                                </TableHead>
                                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                                    DISPONIBLE CENTRAL
                                                </TableHead>
                                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                                    DISPONIBLE TIENDA
                                                </TableHead>
                                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                                    PEDIDO
                                                </TableHead>
                                                <TableHead className="whitespace-nowrap text-center font-semibold text-gray-700 dark:text-gray-200">
                                                    SUBTOTAL
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

                                                const pedidoQuantity = pedido[variation.sku] || 0
                                                const subtotalVariation = pedidoQuantity * (variation.priceList ?? 0)

                                                return (
                                                    <TableRow
                                                        key={`${product.productID}-${variation.variationID}`}
                                                        className={`group hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-200 ${
                                                            isFirst
                                                                ? "border-t-2 border-t-slate-200 dark:border-t-slate-400"
                                                                : "border-t border-gray-100 dark:border-gray-700"
                                                        } text-sm dark:text-gray-300 text-gray-800 h-16`}
                                                    >
                                                        {/* Columna Producto */}
                                                        <TableCell className="py-2 px-3 text-left w-1/4">
                                                            {isFirst && (
                                                                <MotionItem
                                                                    key={`product-${product.productID}`}
                                                                    delay={index + 2}
                                                                >
                                                                    <div className="w-full flex items-center gap-3">
                                                                        <div className="relative">
                                                                            <img
                                                                                src={
                                                                                    product.image || "/placeholder.svg"
                                                                                }
                                                                                alt={product.name}
                                                                                className="w-12 h-12 object-cover rounded border"
                                                                            />
                                                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                                                                {product.ProductVariations.length}
                                                                            </div>
                                                                        </div>
                                                                        <div className="font-medium text-sm block truncate">
                                                                            {product.name}
                                                                        </div>
                                                                    </div>
                                                                </MotionItem>
                                                            )}
                                                            {!isFirst && <div className="w-12 h-12"></div>}
                                                        </TableCell>

                                                        {/* Columna SKU */}
                                                        <TableCell className="text-center dark:hover:bg-gray-900 hover:bg-gray-100 py-2">
                                                            <MotionItem
                                                                key={`sku-${product.productID}-${variation.variationID}`}
                                                                delay={index + 2}
                                                            >
                                                                <Badge variant="outline" className="font-mono text-xs">
                                                                    {variation.sku}
                                                                </Badge>
                                                            </MotionItem>
                                                        </TableCell>

                                                        {/* Columna TALLA */}
                                                        <TableCell className="text-center dark:hover:bg-gray-900 hover:bg-gray-100 cursor-pointer py-2">
                                                            <MotionItem
                                                                key={`size-${product.productID}-${variation.variationID}`}
                                                                delay={index + 2}
                                                            >
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="font-bold text-sm"
                                                                >
                                                                    {variation.sizeNumber}
                                                                </Badge>
                                                            </MotionItem>
                                                        </TableCell>

                                                        {/* Columna COSTO */}
                                                        <TableCell className="w-32 text-center dark:hover:bg-gray-800 hover:bg-gray-50 py-3 transition-colors">
                                                            <MotionItem
                                                                key={`cost-${product.productID}-${variation.variationID}`}
                                                                delay={index + 2}
                                                            >
                                                                <span className="font-semibold text-sm">
                                                                    $
                                                                    {Number(variation.priceList).toLocaleString(
                                                                        "es-CL"
                                                                    )}
                                                                </span>
                                                            </MotionItem>
                                                        </TableCell>

                                                        {/* Columna DISPONIBLE CENTRAL */}
                                                        <TableCell className="w-32 text-center dark:hover:bg-gray-800 hover:bg-gray-50 py-3 transition-colors">
                                                            <MotionItem
                                                                key={`central-${product.productID}-${variation.variationID}`}
                                                                delay={index + 2}
                                                            >
                                                                <Badge
                                                                    variant={
                                                                        variation.stockQuantity < 20
                                                                            ? "destructive"
                                                                            : "default"
                                                                    }
                                                                    className="font-bold text-sm"
                                                                >
                                                                    {variation.stockQuantity}
                                                                </Badge>
                                                            </MotionItem>
                                                        </TableCell>

                                                        {/* Columna DISPONIBLE TIENDA */}
                                                        <TableCell className="w-32 text-center dark:hover:bg-gray-800 hover:bg-gray-50 py-3 transition-colors">
                                                            <MotionItem
                                                                key={`store-${product.productID}-${variation.variationID}`}
                                                                delay={index + 2}
                                                            >
                                                                <Badge
                                                                    variant={
                                                                        stockAgregado > 0 ? "default" : "secondary"
                                                                    }
                                                                    className="font-semibold text-sm"
                                                                >
                                                                    {stockAgregado}
                                                                </Badge>
                                                            </MotionItem>
                                                        </TableCell>

                                                        {/* Columna PEDIDO */}
                                                        <TableCell className="w-32 text-center dark:hover:bg-gray-800 hover:bg-gray-50 py-3 transition-colors">
                                                            <MotionItem
                                                                key={`order-${product.productID}-${variation.variationID}`}
                                                                delay={index + 2}
                                                            >
                                                                <div className="flex justify-center">
                                                                    <Input
                                                                        type="number"
                                                                        className="w-16 h-8 px-2 py-1 text-center text-xs border-2 focus:ring-2 focus:ring-blue-500"
                                                                        value={pedidoQuantity || ""}
                                                                        onChange={(e) =>
                                                                            setPedido((prev) => ({
                                                                                ...prev,
                                                                                [variation.sku]:
                                                                                    Number.parseInt(e.target.value) ||
                                                                                    0,
                                                                            }))
                                                                        }
                                                                    />
                                                                </div>
                                                            </MotionItem>
                                                        </TableCell>

                                                        {/* Columna SUBTOTAL */}
                                                        <TableCell className="w-32 text-center dark:hover:bg-gray-800 hover:bg-gray-50 py-3 transition-colors">
                                                            <MotionItem
                                                                key={`subtotal-${product.productID}-${variation.variationID}`}
                                                                delay={index + 2}
                                                            >
                                                                <span className="font-semibold text-green-600 dark:text-green-400">
                                                                    ${subtotalVariation.toLocaleString("es-CL")}
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
                        </MotionItem>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <MotionItem delay={currentItems.length + 2}>
                                <div className="flex items-center justify-center gap-2 mt-6 pb-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="h-9 px-3 border-2"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Anterior
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
                                                    className={`h-9 w-9 border-2 ${
                                                        currentPage === page
                                                            ? "bg-blue-600 hover:bg-blue-700 border-blue-600"
                                                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                                                    }`}
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
                                        className="h-9 px-3 border-2"
                                    >
                                        Siguiente
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </MotionItem>
                        )}

                        {/* Order Summary and Actions */}
                        <MotionItem delay={currentItems.length + 3}>
                            <div className="mt-6 space-y-4">
                                <div className="flex justify-center lg:justify-end">
                                    <p className="text-lg font-bold">
                                        Subtotal general: ${subtotal.toLocaleString("es-CL")}
                                    </p>
                                </div>

                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <Card className="w-full md:w-1/2">
                                        <CardContent className="p-4 space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="font-medium">Total de productos:</span>
                                                <span className="font-bold">{totalProductsInOrder}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">Total neto:</span>
                                                <span className="font-bold">${subtotal.toLocaleString("es-CL")}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">IVA (19%):</span>
                                                <span className="font-bold">
                                                    ${(subtotal * 0.19).toLocaleString("es-CL")}
                                                </span>
                                            </div>
                                            <div className="flex justify-between border-t pt-2">
                                                <span className="font-bold">Total:</span>
                                                <span className="font-bold text-green-600">
                                                    ${(subtotal * 1.19).toLocaleString("es-CL")}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Button
                                        className="bg-green-600 lg:w-fit w-full hover:bg-green-700 h-12 px-6"
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
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        Generar orden de compra
                                    </Button>
                                </div>
                            </div>
                        </MotionItem>
                    </>
                )}
            </div>
        </main>
    )
}
