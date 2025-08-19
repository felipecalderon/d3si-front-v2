"use client"

import React, { useState, useMemo, useEffect, Suspense } from "react"
import { toast } from "sonner"
import { MotionItem } from "@/components/Animations/motionItem"
import { CategoryProgress } from "@/components/Inventory/CategorySection/CategoryProgress"
import InventoryPagination from "@/components/Inventory/TableSection/InventoryPagination"
import {
    ColumnFilters,
    applyColumnFilters,
    applyVariationFilters,
} from "@/components/Inventory/TableSection/ColumnFilters"
import { createMassiveProducts } from "@/actions/products/createMassiveProducts"
import { deleteProduct } from "@/actions/products/deleteProduct"
import type { IProduct } from "@/interfaces/products/IProduct"
import type { ICategory } from "@/interfaces/categories/ICategory"
import type { IStore } from "@/interfaces/stores/IStore"
import { FlattenedItem } from "@/interfaces/products/IFlatternProduct"
import { useAuth } from "@/stores/user.store"
import { Role } from "@/lib/userRoles"
import { CreateProductFormData } from "@/interfaces/products/ICreateProductForm"
import { inventoryStore } from "@/stores/inventory.store"
import { useTienda } from "@/stores/tienda.store"
import { InventoryTable } from "./TableSection/InventoryTable"
import InventoryHeader from "./HeaderSetion/InventoryHeader"

const ITEMS_PER_PAGE = 10

interface Props {
    initialProducts: IProduct[]
    categories: ICategory[]
    stores: IStore[]
}

export default function UnifiedInventoryClientWrapper({ initialProducts, categories, stores }: Props) {
    const { user } = useAuth()
    const { storeSelected } = useTienda()
    const { currentPage, editValue, editingField, rawProducts, setCurrentPage, setEditingField, setRawProducts } =
        inventoryStore()

    // Column filters state
    const [columnFilters, setColumnFilters] = useState({
        producto: "",
        marca: "",
        categoria: "",
        talla: "",
        precioCosto: "",
        precioPlaza: "",
        ofertas: false,
        stock: "",
        stockAgregado: "",
    })

    // --- 🔹 Filtrar productos por tienda asignada al usuario (si no es Admin)
    const userStoreID = storeSelected?.storeID
    const filteredInitialProducts = useMemo(() => {
        if (user?.role === Role.Admin || !userStoreID) return initialProducts
        return initialProducts.filter((product) =>
            product.ProductVariations.some((variation) =>
                variation.StoreProducts.some((sp) => sp.storeID === userStoreID)
            )
        )
    }, [initialProducts, user?.role, userStoreID])

    const adminStoreIDs = useMemo(() => stores.filter((s) => s.isAdminStore).map((s) => s.storeID), [stores])

    // Stock mostrado según el rol
    const totalStockShown = useMemo(() => {
        if (user?.role === Role.Admin) {
            // Stock central: suma de stockQuantity de todas las variaciones
            return rawProducts.reduce(
                (total, product) => total + product.ProductVariations.reduce((sum, v) => sum + v.stockQuantity, 0),
                0
            )
        } else if (user?.role === Role.Vendedor && userStoreID) {
            // Stock de la tienda: suma de quantity de StoreProducts de la tienda seleccionada
            return rawProducts.reduce((total, product) => {
                return (
                    total +
                    product.ProductVariations.reduce((sum, v) => {
                        const storeProduct = v.StoreProducts.find((sp) => sp.storeID === userStoreID)
                        return sum + (storeProduct ? storeProduct.quantity : 0)
                    }, 0)
                )
            }, 0)
        } else {
            // Otros roles: 0 o lógica adicional si aplica
            return 0
        }
    }, [rawProducts, user?.role, userStoreID])

    // --- 🔹 Apply column filters
    const filteredProducts = useMemo(() => {
        return applyColumnFilters(rawProducts, columnFilters)
    }, [rawProducts, columnFilters])

    // --- 🔹 Flatten variations + apply variation filters
    const flattenedProducts = useMemo<FlattenedItem[]>(() => {
        const flattened: FlattenedItem[] = []
        filteredProducts.forEach((product) => {
            const totalStockQuantity = product.ProductVariations.reduce(
                (total: any, v: { stockQuantity: any }) => total + v.stockQuantity,
                0
            )
            const variationCount = product.ProductVariations.length
            product.ProductVariations.forEach((variation: any, index: number) => {
                flattened.push({
                    product,
                    variation,
                    isFirst: index === 0,
                    totalStock: totalStockQuantity,
                    rowSpan: variationCount,
                })
            })
        })

        return applyVariationFilters(flattened, columnFilters, adminStoreIDs)
    }, [filteredProducts, columnFilters, adminStoreIDs])

    const totalPages = Math.ceil(flattenedProducts.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentItems = flattenedProducts.slice(startIndex, endIndex)

    const uniqueProductsInCurrentPage = useMemo(() => {
        const uniqueProductIds = new Set()
        currentItems.forEach(({ product }) => uniqueProductIds.add(product.productID))
        return uniqueProductIds.size
    }, [currentItems])

    // Resetear página cuando cambian filtros
    useEffect(() => {
        setCurrentPage(1)
    }, [columnFilters])

    const handleFilterChange = (field: string, value: string | boolean) => {
        setColumnFilters((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const clearColumnFilters = () => {
        setColumnFilters({
            producto: "",
            marca: "",
            categoria: "",
            talla: "",
            precioCosto: "",
            precioPlaza: "",
            ofertas: false,
            stock: "",
            stockAgregado: "",
        })
    }

    function handleDeleteProduct(product: IProduct) {
        const confirm = window.confirm(
            `¿Estás seguro de que deseas eliminar el producto "${product.name}"? Esta acción no se puede revertir.`
        )
        if (!confirm) return

        toast.promise(deleteProduct(product.productID), {
            loading: "Eliminando producto...",
            success: () => {
                setRawProducts(rawProducts.filter((p) => p.productID !== product.productID))
                return "Producto eliminado con éxito"
            },
            error: "Hubo un error al eliminar el producto",
        })
    }

    async function handleSaveEdit(product: IProduct, variationID?: string) {
        if (!editingField) return
        const { field } = editingField
        const isEditingBrand = field === "brand"
        const isProductBrand = product.brand === "D3SI" || product.brand === "Otro"
        const isEmptyCategory = product.categoryID === ""

        if (!variationID) {
            const updated = {
                name: field === "name" ? editValue : product.name,
                image: product.image,
                genre: product.genre,
                brand: isEditingBrand ? editValue : isProductBrand ? product.brand : "Otro",
                categoryID: isEmptyCategory ? null : product.categoryID,
                sizes: product.ProductVariations.map((v) => ({
                    sku: v.sku,
                    sizeNumber: v.sizeNumber,
                    priceList: v.priceList,
                    priceCost: v.priceCost,
                    stockQuantity: v.stockQuantity,
                })),
            } as CreateProductFormData
            toast.promise(createMassiveProducts({ products: [updated] }), {
                loading: "Actualizando producto...",
                success: () => {
                    setRawProducts(
                        rawProducts.map((p) => (p.productID === product.productID ? { ...p, [field]: editValue } : p))
                    )
                    setEditingField(null)
                    return "Campo actualizado"
                },
                error: "Error al actualizar",
            })
            return
        }

        // --- 🔹 Update talla/variation
        const variation = product.ProductVariations.find((v) => v.variationID === variationID)
        if (!variation) return
        const updated = {
            name: product.name,
            image: product.image,
            genre: product.genre,
            brand: isProductBrand ? product.brand : "Otro",
            categoryID: isEmptyCategory ? null : product.categoryID,
            sizes: [
                {
                    sku: variation.sku,
                    sizeNumber: field === "sizeNumber" ? editValue : variation.sizeNumber,
                    priceList: field === "priceList" ? Number(editValue) : variation.priceList,
                    priceCost: field === "priceCost" ? Number(editValue) : variation.priceCost,
                    stockQuantity: field === "stockQuantity" ? Number(editValue) : variation.stockQuantity,
                },
            ],
        } as CreateProductFormData

        toast.promise(createMassiveProducts({ products: [updated] }), {
            loading: "Actualizando producto...",
            success: () => {
                setRawProducts(
                    rawProducts.map((p) =>
                        p.productID === product.productID
                            ? {
                                  ...p,
                                  ProductVariations: p.ProductVariations.map((v) =>
                                      v.variationID === variationID
                                          ? {
                                                ...v,
                                                [field]: field === "sizeNumber" ? editValue : Number(editValue),
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
            for (let i = 1; i <= totalPages; i++) pages.push(i)
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

    // --- Inicializar productos filtrados por tienda
    useEffect(() => {
        setRawProducts(filteredInitialProducts)
    }, [filteredInitialProducts])

    return (
        <main className="lg:p-6 flex-1 flex flex-col h-screen">
            {/* Category Progress, no se muestra si es store manager */}
            {user?.role !== Role.Vendedor && user?.role !== Role.Tercero && (
                <MotionItem delay={1}>
                    <CategoryProgress products={filteredProducts} categories={categories} />
                </MotionItem>
            )}

            {/* Header Section */}
            <MotionItem delay={0}>
                <InventoryHeader
                    totalStockCentral={totalStockShown}
                    uniqueProductsInCurrentPage={uniqueProductsInCurrentPage}
                    searchedProductsLength={filteredProducts.length}
                />
                <div className="flex justify-between lg:mt-0 mt-6 lg:flex-row flex-col lg:items-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Página {currentPage} de {totalPages} - {filteredProducts.length} productos (
                        {flattenedProducts.length} variaciones)
                    </p>
                </div>
            </MotionItem>

            {/* Table Section with Column Filters */}
            <div className="flex-1 flex flex-col">
                <MotionItem delay={2} className="flex-1">
                    <div className="flex-1 dark:bg-slate-900 bg-white shadow rounded overflow-hidden">
                        {/* Column Filters */}
                        <ColumnFilters
                            filters={columnFilters}
                            onFilterChange={handleFilterChange}
                            onClearFilters={clearColumnFilters}
                            showPrecioCosto={user?.role !== Role.Vendedor && user?.role !== Role.Tercero}
                            showStockAgregado={user?.role === Role.Admin}
                        />

                        <Suspense fallback={"cargando..."}>
                            <InventoryTable
                                currentItems={currentItems}
                                handleSaveEdit={handleSaveEdit}
                                handleDeleteProduct={handleDeleteProduct}
                                adminStoreIDs={adminStoreIDs}
                                categories={categories}
                            />
                        </Suspense>
                    </div>
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
            </div>
        </main>
    )
}
