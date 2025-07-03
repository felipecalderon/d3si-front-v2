"use client"
import React, { useState, useMemo, useEffect } from "react"
import { getAllProducts } from "@/actions/products/getAllProducts"
import { getAllCategories } from "@/actions/categories/getAllCategories"
import { createMassiveProducts } from "@/actions/products/createMassiveProducts"
import { getAllStores } from "@/actions/stores/getAllStores"
import type { IProduct } from "@/interfaces/products/IProduct"
import type { ICategory } from "@/interfaces/categories/ICategory"
import type { IStore } from "@/interfaces/stores/IStore"
import InventoryActions from "@/components/Inventory/InventoryActions"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { deleteProduct } from "@/actions/products/deleteProduct"
import { toast } from "sonner"
import TableSkeleton from "@/components/ListTable/TableSkeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MotionItem } from "@/components/Animations/motionItem"
import { CategoryProgress } from "@/components/Inventory/CategoryProgress"
import { InventoryTable } from "@/components/Inventory/InventoryTable"
import { ListFilters } from "@/components/ListTable/ListFilters"
import { useProductFilters } from "@/hooks/use-product-filters"

const ITEMS_PER_PAGE = 10

export default function InventoryPage() {
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [rawProducts, setRawProducts] = useState<IProduct[]>([])
    const [categories, setCategories] = useState<ICategory[]>([])
    const [stores, setStores] = useState<IStore[]>([])
    const [addSizeModalProductID, setAddSizeModalProductID] = useState<string | null>(null)
    const [editingField, setEditingField] = useState<{
        sku: string
        field: "priceCost" | "priceList" | "stockQuantity" | "sizeNumber"
    } | null>(null)
    const [editValue, setEditValue] = useState<string>("")
    const [currentPage, setCurrentPage] = useState(1)

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

    const totalStockCentral = useMemo(
        () =>
            rawProducts.reduce(
                (total, product) =>
                    total + product.ProductVariations.reduce((sum, variation) => sum + variation.stockQuantity, 0),
                0
            ),
        [rawProducts]
    )

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
        const flattened: Array<{
            product: IProduct
            variation: any
            isFirst: boolean
            totalStock: number
            rowSpan: number
        }> = []

        searchedProducts.forEach((product) => {
            const totalStockQuantity = product.ProductVariations.reduce((total, v) => total + v.stockQuantity, 0)
            const variationCount = product.ProductVariations.length

            product.ProductVariations.forEach((variation, index) => {
                flattened.push({
                    product,
                    variation,
                    isFirst: index === 0,
                    totalStock: totalStockQuantity,
                    rowSpan: variationCount,
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

    // Calcular productos únicos en la página actual
    const uniqueProductsInCurrentPage = useMemo(() => {
        const uniqueProductIds = new Set()
        currentItems.forEach(({ product }) => {
            uniqueProductIds.add(product.productID)
        })
        return uniqueProductIds.size
    }, [currentItems])

    // Reset to first page when search or filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [search, selectedFilter, sortDirection, selectedCategory, selectedGenre])

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

    // Obtener la primera categoría del producto o usar un valor por defecto
    const categoryName =
      product.categoryID &&
      Array.isArray(product.categoryID) &&
      product.categoryID.length > 0 &&
      product.categoryID[0] &&
      product.categoryID[0].name
        ? product.categoryID[0].name
        : "Sin categoría"

    const updated = {
      name: product.name,
      image: product.image,
      genre: product.genre,
      category: categoryName, // Agregar la categoría requerida
      sizes: [
        {
          sku: variation.sku,
          sizeNumber: editingField!.field === "sizeNumber" ? editValue : variation.sizeNumber,
          priceList: editingField!.field === "priceList" ? Number.parseFloat(editValue) : variation.priceList,
          priceCost: editingField!.field === "priceCost" ? Number.parseFloat(editValue) : variation.priceCost,
          stockQuantity:
            editingField!.field === "stockQuantity" ? Number.parseFloat(editValue) : variation.stockQuantity,
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
                            editingField!.field === "sizeNumber" ? editValue : Number.parseFloat(editValue),
                        }
                      : v,
                  ),
                }
              : p,
          ),
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

                        <div className="h-11">
                            <InventoryActions products={rawProducts} />
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

                    <div className="flex justify-between lg:mt-0 mt-6 lg:flex-row flex-col lg:items-center">
                        <div className="flex items-center gap-4">
                            <Badge variant="secondary" className="text-sm px-3 py-1">
                                <span className="text-blue-600 dark:text-blue-400 font-bold">{totalStockCentral}</span>
                                <span className="ml-1">productos en stock</span>
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

            {/* Category Progress */}
            <MotionItem delay={1}>
                <CategoryProgress products={searchedProducts} />
            </MotionItem>

            {/* Table Section */}
            <div className="flex-1 flex flex-col">
                {isLoading ? (
                    <TableSkeleton />
                ) : (
                    <>
                        <MotionItem delay={2} className="flex-1">
                            <InventoryTable
                                currentItems={currentItems}
                                editingField={editingField}
                                setEditingField={setEditingField}
                                editValue={editValue}
                                setEditValue={setEditValue}
                                handleSaveEdit={handleSaveEdit}
                                handleDeleteProduct={handleDeleteProduct}
                                addSizeModalProductID={addSizeModalProductID}
                                setAddSizeModalProductID={setAddSizeModalProductID}
                                setRawProducts={setRawProducts}
                                adminStoreIDs={adminStoreIDs}
                            />
                        </MotionItem>
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <MotionItem delay={currentItems.length + 3}>
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
                    </>
                )}
            </div>
        </main>
    )
}
