"use client"

import React, { useState, useMemo, useEffect } from "react"
import type { IProduct } from "@/interfaces/products/IProduct"
import type { IStore } from "@/interfaces/stores/IStore"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import { MotionItem } from "@/components/Animations/motionItem"
import { ListFilters } from "@/components/ListTable/ListFilters"
import { useRouter } from "next/navigation"
import { PurchaseOrderClientProps } from "@/interfaces/orders/IPurchaseOrder"
import { PurchaseOrderSummary } from "./PurchaseOrderSummary"
import { PurchaseOrderTable } from "./PurchaseOrderTable"
import { useProductFilter } from "@/stores/productsFilters"
import { inventoryStore } from "@/stores/inventory.store"
import { useAuth } from "@/stores/user.store"
import { useTienda } from "@/stores/tienda.store"

const ITEMS_PER_PAGE = 10

export default function PurchaseOrderClient({
    initialProducts,
    initialCategories,
    initialStores,
}: PurchaseOrderClientProps) {
    const router = useRouter()
    const { user } = useAuth()
    // Estados
    const [search, setSearch] = useState("")
    const [stores] = useState<IStore[]>(initialStores)
    const { storeSelected } = useTienda()
    // Si es admin, puede elegir tienda; si es store_manager, usa la global
    const [selectedStoreID, setSelectedStoreID] = useState<string>("")
    const [pedido, setPedido] = useState<Record<string, number>>({})
    const [currentPage, setCurrentPage] = useState(1)
    const [isLargeScreen, setIsLargeScreen] = useState(false)

    // Hook para filtros personalizados
    const {
        selectedFilter,
        sortDirection,
        selectedGenre,
        filteredAndSortedProducts,
        setSelectedFilter,
        setSortDirection,
        setSelectedGenre,
        clearFilters,
    } = useProductFilter()

    const { setRawProducts } = inventoryStore()

    // Filtrar productos por tienda seleccionada (admin ve todos)
    const filteredByStore = useMemo(() => {
        // Si es admin y no ha seleccionado tienda, ve todos
        if (user?.role === "admin" && !selectedStoreID) return filteredAndSortedProducts
        // Si es store_manager, filtra por la tienda global
        if (user?.role === "store_manager" && storeSelected?.storeID) {
            return filteredAndSortedProducts.filter((product) =>
                product.ProductVariations.some((variation) =>
                    variation.StoreProducts.some((storeProduct) => storeProduct.storeID === storeSelected.storeID)
                )
            )
        }
        // Por defecto, retorna todos
        return filteredAndSortedProducts
    }, [filteredAndSortedProducts, selectedStoreID, user?.role, storeSelected?.storeID])

    // Filtrar productos según búsqueda
    const searchedProducts = useMemo(() => {
        if (!search.trim()) return filteredByStore
        const lower = search.toLowerCase()
        return filteredByStore.filter(
            (product) =>
                product.name.toLowerCase().includes(lower) ||
                product.ProductVariations.some((v) => v.sku?.toLowerCase().includes(lower))
        )
    }, [search, filteredByStore])

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
        return initialProducts.reduce((total, product) => {
            return (
                total +
                product.ProductVariations.reduce((sub, variation) => {
                    const qty = pedido[variation.sku] || 0
                    return sub + qty * (variation.priceList ?? 0)
                }, 0)
            )
        }, 0)
    }, [pedido, initialProducts])

    const totalProductsInOrder = useMemo(() => {
        return Object.values(pedido).reduce((acc, curr) => acc + curr, 0)
    }, [pedido])

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
    // Resetear página cuando cambian filtros o búsqueda
    useEffect(() => {
        setCurrentPage(1)
    }, [search, selectedFilter, sortDirection, selectedGenre])

    useEffect(() => {
        setRawProducts(initialProducts)
        setSelectedFilter("genre")
    }, [])

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsLargeScreen(window.innerWidth >= 1024)
        }
    }, [])
    const selectedID = user?.role === "admin" ? selectedStoreID : storeSelected?.storeID || ""
    return (
        <>
            <main className="p-6 flex-1 flex flex-col min-h-screen" style={{ paddingBottom: "120px" }}>
                {/* Header Section */}
                <MotionItem delay={0}>
                    <div className="flex flex-col gap-4 mb-6">
                        {/* Filtros */}
                        <ListFilters
                            products={filteredAndSortedProducts}
                            selectedFilter={selectedFilter}
                            sortDirection={sortDirection}
                            selectedGenre={selectedGenre}
                            onFilterChange={setSelectedFilter}
                            onSortDirectionChange={setSortDirection}
                            onGenreChange={setSelectedGenre}
                            onClearFilters={clearFilters}
                        />
                        <div className="flex lg:flex-row flex-col items-center gap-4">
                            <div className="flex w-full justify-between items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-semibold whitespace-nowrap">
                                        Orden de compra para:
                                    </span>
                                    {user?.role === "admin" ? (
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
                                    ) : (
                                        <Select value={storeSelected?.storeID || ""} disabled>
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
                                    )}
                                </div>
                                {/*
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleAgregarCalzados}
                                        className="h-11 bg-green-600 hover:bg-green-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Agregar +1
                                    </Button>
                                    <Button variant="destructive" onClick={handleQuitarCalzados} className="h-11">
                                        <Minus className="w-4 h-4 mr-2" />
                                        Quitar -1
                                    </Button>
                                </div>
                                */}
                            </div>
                        </div>

                        <div className="flex justify-between lg:mt-0 mt-6 lg:flex-row flex-col lg:items-center">
                            <div className="flex lg:mb-0 mb-4 items-center gap-4">
                                <Badge
                                    variant="secondary"
                                    className="text-sm px-3 py-1 lg:flex-row flex-col text-center"
                                >
                                    <div className="flex">
                                        <ShoppingCart className="w-4 h-4 mr-1" />
                                        <span className="text-blue-600 dark:text-blue-400 font-bold">
                                            {totalProductsInOrder}
                                        </span>
                                    </div>
                                    <span className="ml-1">productos en pedido</span>
                                </Badge>
                                <Badge variant="outline" className="text-sm px-3 py-1 lg:flex-row flex-col text-center">
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Mostrando:</span>
                                        <span className="ml-1 font-bold text-blue-600 dark:text-blue-400">
                                            {uniqueProductsInCurrentPage}
                                        </span>
                                    </div>
                                    {/*Aqui debe ir los botones de agregar o quitar */}

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

                {/* Barra de búsqueda y tabla */}
                <div className="flex lg:flex-row flex-col items-center gap-4 mb-4">
                    <Input
                        type="text"
                        placeholder="Buscar producto o código EAN..."
                        className="flex-1 h-11 border-2 dark:bg-gray-800 bg-white px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {/* Tabla de productos */}
                <div className="flex-1 overflow-y-auto flex flex-col">
                    <MotionItem delay={1} className="flex-1">
                        <PurchaseOrderTable
                            currentItems={currentItems}
                            pedido={pedido}
                            setPedido={setPedido}
                            selectedStoreID={selectedID}
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
                                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
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
                                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="h-9 px-3 border-2"
                            >
                                Siguiente
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </MotionItem>
                )}
            </main>
            {/*Barra de resumen del total estatica*/}
            <MotionItem>
                <div className=" fixed left-0 right-0 bottom-0 z-50 dark:bg-slate-900 bg-slate-200 shadow-[4px_-4px_8px_rgba(0,0,0,0.1)] dark:shadow-slate-950 shadow-slate-400 border-t px-8 py-1 transition-all duration-300 w-full lg:ml-[260px] lg:w-[calc(100%-250px)]">
                    <PurchaseOrderSummary
                        totalProductsInOrder={totalProductsInOrder}
                        subtotal={subtotal}
                        isLoading={false}
                        selectedStoreID={user?.role === "admin" ? selectedStoreID : storeSelected?.storeID || ""}
                        pedido={pedido}
                        rawProducts={initialProducts}
                        setPedido={setPedido}
                        router={router}
                    />
                </div>
            </MotionItem>
        </>
    )
}
