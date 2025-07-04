/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useMemo, useEffect } from "react"
import type { IProduct } from "@/interfaces/products/IProduct"
import type { ICategory } from "@/interfaces/categories/ICategory"
import type { IStore } from "@/interfaces/stores/IStore"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, ShoppingCart } from "lucide-react"
import { MotionItem } from "@/components/Animations/motionItem"
import { ListFilters } from "@/components/ListTable/ListFilters"
import { useProductFilters } from "@/hooks/use-product-filters"
import { useRouter } from "next/navigation"
import { PurchaseOrderClientProps } from "@/interfaces/orders/IPurchaseOrder"
import { PurchaseOrderSummary } from "./PurchaseOrderSummary"
import { PurchaseOrderTable } from "./PurchaseOrderTable"

const ITEMS_PER_PAGE = 10

export default function PurchaseOrderClient({
    initialProducts,
    initialCategories,
    initialStores,
}: PurchaseOrderClientProps) {
    const router = useRouter()

    // Estados
    const [search, setSearch] = useState("")
    const [rawProducts] = useState<IProduct[]>(initialProducts)
    const [categories] = useState<ICategory[]>(initialCategories)
    const [stores] = useState<IStore[]>(initialStores)
    const [selectedStoreID, setSelectedStoreID] = useState<string>("")
    const [pedido, setPedido] = useState<Record<string, number>>({})
    const [currentPage, setCurrentPage] = useState(1)

    // Hook para filtros personalizados
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

    // Filtrar productos según búsqueda
    const searchedProducts = useMemo(() => {
        if (!search.trim()) return filteredAndSortedProducts
        const lower = search.toLowerCase()
        return filteredAndSortedProducts.filter(
            (product) =>
                product.name.toLowerCase().includes(lower) ||
                product.ProductVariations.some((v) => v.sku?.toLowerCase().includes(lower))
        )
    }, [search, filteredAndSortedProducts])

    // Aplanar productos con variaciones para paginación
    const flattenedProducts = useMemo(() => {
        const flattened: Array<{ product: IProduct; variation: any; isFirst: boolean }> = []

        searchedProducts.forEach((product) => {
            product.ProductVariations.forEach((variation, index) => {
                flattened.push({
                    product,
                    variation,
                    isFirst: index === 0,
                })
            })
        })

        return flattened
    }, [searchedProducts])

    const totalPages = Math.ceil(flattenedProducts.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentItems = flattenedProducts.slice(startIndex, endIndex)

    // Resetear página cuando cambian filtros o búsqueda
    useEffect(() => {
        setCurrentPage(1)
    }, [search, selectedFilter, sortDirection, selectedCategory, selectedGenre])

    const totalProductsInOrder = useMemo(() => {
        return Object.values(pedido).reduce((acc, curr) => acc + curr, 0)
    }, [pedido])

    // Funciones para agregar o quitar productos a pedido
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

    // Calcular productos únicos en la página actual
    const uniqueProductsInCurrentPage = useMemo(() => {
        const uniqueProductIds = new Set<string>()
        currentItems.forEach(({ product }) => uniqueProductIds.add(product.productID))
        return uniqueProductIds.size
    }, [currentItems])
    // Calcular subtotal de pedido
    const subtotal = useMemo(() => {
        return rawProducts.reduce((total, product) => {
            return (
                total +
                product.ProductVariations.reduce((sub, variation) => {
                    const qty = pedido[variation.sku] || 0
                    return sub + qty * (variation.priceList ?? 0)
                }, 0)
            )
        }, 0)
    }, [pedido, rawProducts])

    // Función para obtener páginas visibles en paginación
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

    //  const userID = "2f13abf6-bbb6-402b-a5b2-e368a89c79e9" // O donde obtengas el userID

    return (
        <main className="p-6 flex-1 flex flex-col min-h-screen">
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

            {/* Tabla de productos */}
            <div className="flex-1 overflow-y-auto flex flex-col">
                <MotionItem delay={1} className="flex-1">
                    <PurchaseOrderTable
                        currentItems={currentItems}
                        pedido={pedido}
                        adminStoreIDs={[]}
                        setPedido={setPedido}
                    />
                </MotionItem>
            </div>
            {/* Paginación */}
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
                            Anterior
                        </Button>

                        {getVisiblePages().map((page, index) =>
                            page === "..." ? (
                                <span key={index} className="px-2 text-gray-500">
                                    ...
                                </span>
                            ) : (
                                <Button
                                    key={index}
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
                            )
                        )}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="h-9 px-3 border-2"
                        >
                            Siguiente
                        </Button>
                    </div>
                </MotionItem>
            )}

            {/* Resumen y acción de crear orden */}
            <PurchaseOrderSummary
                totalProductsInOrder={totalProductsInOrder}
                subtotal={subtotal}
                isLoading={false}
                selectedStoreID={selectedStoreID}
                pedido={pedido}
                rawProducts={rawProducts}
                setPedido={setPedido}
                router={router}
            />
        </main>
    )
}
