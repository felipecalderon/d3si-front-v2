"use client"

import React, { Suspense, useEffect } from "react"
import { toast } from "sonner"
import { MotionItem } from "@/components/Animations/motionItem"
import { CategoryProgress } from "../CategorySection/CategoryProgress"
import InventoryPagination from "@/components/Inventory/TableSection/InventoryPagination"
import { ColumnFilters } from "@/components/Inventory/TableSection/ColumnFilters"
import { createMassiveProducts } from "@/actions/products/createMassiveProducts"
import { deleteProduct } from "@/actions/products/deleteProduct"
import type { IProduct } from "@/interfaces/products/IProduct"
import type { ICategory } from "@/interfaces/categories/ICategory"
import type { IStore } from "@/interfaces/stores/IStore"
import { useAuth } from "@/stores/user.store"
import { Role } from "@/lib/userRoles"
import { CreateProductFormData } from "@/interfaces/products/ICreateProductForm"
import { inventoryStore } from "@/stores/inventory.store"
import { useCategories } from "@/stores/categories.store"
import { InventoryTable } from "./TableSection/InventoryTable"
import InventoryHeader from "./HeaderSetion/InventoryHeader"
import { useInventory } from "@/hooks/useInventory"

interface Props {
    initialProducts: IProduct[]
    categories: ICategory[]
    stores: IStore[]
}

export default function UnifiedInventoryClientWrapper({ initialProducts, categories: cats, stores }: Props) {
    const { user } = useAuth()
    const { categories, setCategories } = useCategories()
    const {
        rawProducts,
        setRawProducts,
        columnFilters,
        handleFilterChange,
        clearColumnFilters,
        setEditingField,
        editValue,
    } = inventoryStore()

    const {
        currentItems,
        totalPages,
        currentPage,
        uniqueProductsInCurrentPage,
        totalStockShown,
        filteredProducts,
        flattenedProducts,
        adminStoreIDs,
        getVisiblePages,
        setCurrentPage,
        filteredStockTotal,
    } = useInventory(initialProducts, stores)

    useEffect(() => {
        setCategories(cats)
    }, [])

    useEffect(() => {
        return () => {
            clearColumnFilters()
        }
    }, [])

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
        const editingField = inventoryStore.getState().editingField
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

    return (
        <main className="lg:p-6 flex-1 flex flex-col h-screen">
            {user?.role !== Role.Vendedor && user?.role !== Role.Tercero && (
                <MotionItem delay={1}>
                    <CategoryProgress products={filteredProducts} categories={categories} />
                </MotionItem>
            )}

            <MotionItem delay={0}>
                <InventoryHeader
                    totalStockCentral={totalStockShown}
                    filteredStockTotal={filteredStockTotal}
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

            <div className="flex-1 flex flex-col">
                <MotionItem delay={2} className="flex-1">
                    <div className="flex-1 dark:bg-slate-900 bg-white shadow rounded overflow-hidden">
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
