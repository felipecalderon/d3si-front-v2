"use client"

import React, { useState, useMemo, useEffect } from "react"
import { toast } from "sonner"
import TableSkeleton from "@/components/ListTable/TableSkeleton"
import { MotionItem } from "@/components/Animations/motionItem"
import { CategoryProgress } from "@/components/Inventory/CategorySection/CategoryProgress"
import { InventoryTable } from "@/components/Inventory/TableSection/InventoryTable"
import { useProductFilters } from "@/hooks/use-product-filters"
import InventoryHeader from "@/components/Inventory/HeaderSetion/InventoryHeader"
import InventoryPagination from "@/components/Inventory/TableSection/InventoryPagination"
import { createMassiveProducts } from "@/actions/products/createMassiveProducts"
import { deleteProduct } from "@/actions/products/deleteProduct"
import type { IProduct } from "@/interfaces/products/IProduct"
import type { ICategory } from "@/interfaces/categories/ICategory"
import type { IStore } from "@/interfaces/stores/IStore"
import { FlattenedItem } from "@/interfaces/products/IFlatternProduct"
import { useAuth } from "@/stores/user.store"
import { Role } from "@/lib/userRoles"
import { CreateProductFormData } from "@/interfaces/products/ICreateProductForm"

const ITEMS_PER_PAGE = 10

interface Props {
    initialProducts: IProduct[]
    categories: ICategory[]
    stores: IStore[]
}

export default function InventoryClientWrapper({ initialProducts, categories, stores }: Props) {
    const { user } = useAuth()
    const [search, setSearch] = useState("")
    const [isLoading] = useState(false)
    const [rawProducts, setRawProducts] = useState<IProduct[]>(initialProducts)
    const [addSizeModalProductID, setAddSizeModalProductID] = useState<string | null>(null)
    const [editingField, setEditingField] = useState<{
        sku: string
        field: "priceCost" | "priceList" | "stockQuantity" | "sizeNumber"
    } | null>(null)
    const [editValue, setEditValue] = useState<string>("")
    const [currentPage, setCurrentPage] = useState(1)

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

    const adminStoreIDs = useMemo(() => stores.filter((s) => s.isAdminStore).map((s) => s.storeID), [stores])

    const totalStockCentral = useMemo(
        () =>
            rawProducts.reduce(
                (total, product) => total + product.ProductVariations.reduce((sum, v) => sum + v.stockQuantity, 0),
                0
            ),
        [rawProducts]
    )

    const searchedProducts = useMemo(() => {
        if (!search.trim()) return filteredAndSortedProducts
        const lower = search.toLowerCase()
        return filteredAndSortedProducts.filter(
            (product) =>
                product.name.toLowerCase().includes(lower) ||
                product.ProductVariations.some((v) => v.sku?.toLowerCase().includes(lower))
        )
    }, [search, filteredAndSortedProducts])

    const flattenedProducts = useMemo<FlattenedItem[]>(() => {
        const flattened: FlattenedItem[] = []
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

    const totalPages = Math.ceil(flattenedProducts.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentItems = flattenedProducts.slice(startIndex, endIndex)

    const uniqueProductsInCurrentPage = useMemo(() => {
        const uniqueProductIds = new Set()
        currentItems.forEach(({ product }) => uniqueProductIds.add(product.productID))
        return uniqueProductIds.size
    }, [currentItems])

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
            category: categoryName,
            childCategory: "",
            brand: "Otro",
            categoryID: "",
            sizes: [
                {
                    sku: variation.sku,
                    sizeNumber: editingField!.field === "sizeNumber" ? editValue : variation.sizeNumber,
                    priceList: editingField!.field === "priceList" ? Number.parseFloat(editValue) : variation.priceList,
                    priceCost: editingField!.field === "priceCost" ? Number.parseFloat(editValue) : variation.priceCost,
                    stockQuantity:
                        editingField!.field === "stockQuantity"
                            ? Number.parseFloat(editValue)
                            : variation.stockQuantity,
                },
            ],
        } as CreateProductFormData

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
                                                        : Number.parseFloat(editValue),
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
        const pages: (number | "...")[] = []
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
        <main className="lg:p-6 flex-1 flex flex-col h-screen">
            {/* Category Progress, no se muestra si es store manager */}
            {user?.role !== Role.Vendedor && (
                <MotionItem delay={1}>
                    <CategoryProgress products={searchedProducts} categories={categories} />
                </MotionItem>
            )}

            {/* Header Section */}
            <MotionItem delay={0}>
                <InventoryHeader
                    search={search}
                    setSearch={setSearch}
                    rawProducts={rawProducts}
                    categories={categories}
                    selectedFilter={selectedFilter}
                    sortDirection={sortDirection}
                    selectedCategory={selectedCategory}
                    selectedGenre={selectedGenre}
                    setSelectedFilter={setSelectedFilter}
                    setSortDirection={setSortDirection}
                    setSelectedCategory={setSelectedCategory}
                    setSelectedGenre={setSelectedGenre}
                    clearFilters={clearFilters}
                    totalStockCentral={totalStockCentral}
                    uniqueProductsInCurrentPage={uniqueProductsInCurrentPage}
                    searchedProductsLength={searchedProducts.length}
                />
                <div className="flex justify-between lg:mt-0 mt-6 lg:flex-row flex-col lg:items-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Página {currentPage} de {totalPages} - {searchedProducts.length} productos (
                        {flattenedProducts.length} variaciones)
                    </p>
                </div>
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
                                categories={[]}
                            />
                        </MotionItem>
                        {totalPages > 1 && (
                            <MotionItem delay={currentItems.length + 3}>
                                <InventoryPagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    getVisiblePages={getVisiblePages}
                                    setCurrentPage={setCurrentPage}
                                />
                            </MotionItem>
                        )}
                    </>
                )}
            </div>
        </main>
    )
}
