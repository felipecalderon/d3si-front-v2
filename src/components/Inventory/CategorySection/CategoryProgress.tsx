"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CategoryProgressHeader } from "./CategoryProgressHeader"
import { CategoryPieChart } from "./CategoryPieChart"
import { CategoryProgressBars } from "./CategoryProgressBars"
import { CategoryManagementModal } from "./EditCategory/CategoryManagementModal"
import type { IProduct } from "@/interfaces/products/IProduct"
import type { ICategory } from "@/interfaces/categories/ICategory"

interface CategoryProgressProps {
    products: IProduct[]
    categories?: ICategory[]
}

type ViewMode = "categoria" | "tipo"

export function CategoryProgress({ products, categories = [] }: CategoryProgressProps) {
    const [viewMode, setViewMode] = useState<ViewMode>("tipo")
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
    const [showModal, setShowModal] = useState(false)

    // Datos para vista por tipo (género)
    const typeStats = useMemo(() => {
        return products.reduce((acc, product) => {
            const type = product.genre || "Sin género"

            if (!acc[type]) {
                acc[type] = {
                    totalCost: 0,
                    totalRevenue: 0,
                    count: 0,
                    productCount: 0,
                }
            }

            acc[type].productCount += 1

            product.ProductVariations.forEach((variation) => {
                const cost = variation.priceCost * variation.stockQuantity
                const revenue = variation.priceList * variation.stockQuantity

                acc[type].totalCost += cost
                acc[type].totalRevenue += revenue
                acc[type].count += variation.stockQuantity
            })

            return acc
        }, {} as Record<string, { totalCost: number; totalRevenue: number; count: number; productCount: number }>)
    }, [products])

    // Datos para vista por categoría
    const categoryStats = useMemo(() => {
        console.log("Calculating categoryStats...")
        console.log(
            "Available categories:",
            categories.map((c) => ({ id: c.categoryID, name: c.name }))
        )
        console.log(
            "Products with categories:",
            products.map((p) => ({ name: p.name, categoryID: p.categoryID }))
        )

        // Crear un mapa de todas las categorías (incluyendo subcategorías)
        const allCategoriesMap = new Map()
        categories.forEach((cat) => {
            allCategoriesMap.set(cat.categoryID, cat)
        })

        // Identificar categorías padre
        const parentCategories = categories.filter((cat) => cat.parentID === null || cat.parentID === "")
        console.log(
            "Parent categories:",
            parentCategories.map((c) => ({ id: c.categoryID, name: c.name }))
        )

        const result = {}

        parentCategories.forEach((parentCategory) => {
            // Obtener subcategorías de esta categoría padre
            const subcategories = categories.filter((cat) => cat.parentID === parentCategory.categoryID)
            console.log(
                `Subcategories for ${parentCategory.name}:`,
                subcategories.map((s) => ({ id: s.categoryID, name: s.name }))
            )

            // IDs a buscar: si hay subcategorías, buscar en subcategorías; si no, buscar en la categoría padre
            const targetIds =
                subcategories.length > 0 ? subcategories.map((sub) => sub.categoryID) : [parentCategory.categoryID]

            console.log(`Looking for products with categoryIDs:`, targetIds)

            // Buscar productos que coincidan con estos IDs
            const categoryProducts = products.filter((p) => p.categoryID && targetIds.includes(p.categoryID))
            console.log(`Found ${categoryProducts.length} products for ${parentCategory.name}`)

            if (categoryProducts.length > 0) {
                let totalCost = 0
                let totalRevenue = 0
                let count = 0
                const productCount = categoryProducts.length

                categoryProducts.forEach((product) => {
                    product.ProductVariations.forEach((variation) => {
                        const cost = variation.priceCost * variation.stockQuantity
                        const revenue = variation.priceList * variation.stockQuantity

                        totalCost += cost
                        totalRevenue += revenue
                        count += variation.stockQuantity
                    })
                })

                result[parentCategory.categoryID] = {
                    name: parentCategory.name,
                    totalCost,
                    totalRevenue,
                    count,
                    productCount,
                    subcategories,
                }
            }
        })

        // Agregar productos sin categoría o con categorías no encontradas
        const productsWithoutValidCategory = products.filter((p) => {
            if (!p.categoryID) return true
            return !allCategoriesMap.has(p.categoryID)
        })

        if (productsWithoutValidCategory.length > 0) {
            console.log(`Found ${productsWithoutValidCategory.length} products without valid category`)

            let totalCost = 0
            let totalRevenue = 0
            let count = 0
            const productCount = productsWithoutValidCategory.length

            productsWithoutValidCategory.forEach((product) => {
                product.ProductVariations.forEach((variation) => {
                    const cost = variation.priceCost * variation.stockQuantity
                    const revenue = variation.priceList * variation.stockQuantity

                    totalCost += cost
                    totalRevenue += revenue
                    count += variation.stockQuantity
                })
            })

            result["sin-categoria"] = {
                name: "Sin Categoría",
                totalCost,
                totalRevenue,
                count,
                productCount,
                subcategories: [],
            }
        }

        console.log("Final categoryStats:", result)
        return result
    }, [products, categories])

    // Datos para subcategorías de la categoría seleccionada
    const subcategoryStats = useMemo(() => {
        if (!selectedCategoryId || !categoryStats[selectedCategoryId]) return []

        const selectedCategory = categoryStats[selectedCategoryId]

        // Si es "sin-categoria", no hay subcategorías
        if (selectedCategoryId === "sin-categoria") return []

        // Si no hay subcategorías, retornar array vacío
        if (selectedCategory.subcategories.length === 0) return []

        return selectedCategory.subcategories
            .map((subcat) => {
                const subcatProducts = products.filter((p) => p.categoryID === subcat.categoryID)

                let totalCost = 0
                let totalRevenue = 0
                let count = 0
                const productCount = subcatProducts.length

                subcatProducts.forEach((product) => {
                    product.ProductVariations.forEach((variation) => {
                        const cost = variation.priceCost * variation.stockQuantity
                        const revenue = variation.priceList * variation.stockQuantity

                        totalCost += cost
                        totalRevenue += revenue
                        count += variation.stockQuantity
                    })
                })

                const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0

                return {
                    name: subcat.name,
                    totalCost,
                    totalRevenue,
                    totalValue: totalRevenue,
                    count,
                    productCount,
                    profitMargin: Math.max(0, Math.min(100, profitMargin)),
                }
            })
            .filter((subcat) => subcat.productCount > 0)
            .sort((a, b) => b.totalValue - a.totalValue)
    }, [selectedCategoryId, categoryStats, products])

    // Preparar datos para el pie chart
    const pieData = useMemo(() => {
        const COLORS = [
            "#3B82F6",
            "#10B981",
            "#8B5CF6",
            "#F59E0B",
            "#EC4899",
            "#6366F1",
            "#EF4444",
            "#EAB308",
            "#14B8A6",
            "#06B6D4",
        ]

        if (viewMode === "tipo") {
            return Object.entries(typeStats)
                .map(([type, stats]) => {
                    const profitMargin =
                        stats.totalRevenue > 0 ? ((stats.totalRevenue - stats.totalCost) / stats.totalRevenue) * 100 : 0

                    return {
                        name: type,
                        profitMargin: Math.max(0, Math.min(100, profitMargin)),
                        totalValue: stats.totalRevenue,
                        totalProfit: stats.totalRevenue - stats.totalCost,
                        count: stats.count,
                        productCount: stats.productCount,
                    }
                })
                .sort((a, b) => b.totalProfit - a.totalProfit)
                .map((item, index) => ({
                    ...item,
                    color: COLORS[index % COLORS.length],
                }))
        } else {
            const categoryData = Object.entries(categoryStats)
                .map(([categoryId, stats]) => {
                    const profitMargin =
                        stats.totalRevenue > 0 ? ((stats.totalRevenue - stats.totalCost) / stats.totalRevenue) * 100 : 0

                    return {
                        id: categoryId,
                        name: stats.name,
                        profitMargin: Math.max(0, Math.min(100, profitMargin)),
                        totalValue: stats.totalRevenue,
                        totalProfit: stats.totalRevenue - stats.totalCost,
                        count: stats.count,
                        productCount: stats.productCount,
                    }
                })
                .sort((a, b) => b.totalProfit - a.totalProfit)
                .map((item, index) => ({
                    ...item,
                    color: COLORS[index % COLORS.length],
                }))

            console.log("Category pie data:", categoryData)
            return categoryData
        }
    }, [viewMode, typeStats, categoryStats])

    // Datos para el progress lateral
    const progressData = useMemo(() => {
        if (viewMode === "tipo") {
            const totalProducts = pieData.reduce((sum, item) => sum + item.productCount, 0)
            return pieData.map((item) => ({
                ...item,
                percentage: totalProducts > 0 ? (item.productCount / totalProducts) * 100 : 0,
            }))
        } else {
            // En modo categoría, mostrar subcategorías de la categoría seleccionada
            if (selectedCategoryId && subcategoryStats.length > 0) {
                const totalSubcatProducts = subcategoryStats.reduce((sum, item) => sum + item.productCount, 0)
                const COLORS = [
                    "#3B82F6",
                    "#10B981",
                    "#8B5CF6",
                    "#F59E0B",
                    "#EC4899",
                    "#6366F1",
                    "#EF4444",
                    "#EAB308",
                    "#14B8A6",
                    "#06B6D4",
                ]

                return subcategoryStats.map((item, index) => ({
                    ...item,
                    percentage: totalSubcatProducts > 0 ? (item.productCount / totalSubcatProducts) * 100 : 0,
                    color: COLORS[index % COLORS.length],
                }))
            } else {
                return []
            }
        }
    }, [viewMode, pieData, selectedCategoryId, subcategoryStats])

    // Auto-seleccionar la categoría con mayor porcentaje cuando cambie a modo categoría
    useMemo(() => {
        if (viewMode === "categoria" && !selectedCategoryId && pieData.length > 0) {
            const topCategory = pieData[0] as any
            if (topCategory.id) {
                setSelectedCategoryId(topCategory.id)
            }
        }
    }, [viewMode, pieData, selectedCategoryId])

    const handlePieClick = (data: any) => {
        if (viewMode === "categoria" && data.id) {
            setSelectedCategoryId(data.id)
        }
    }

    const handleModeChange = (mode: ViewMode) => {
        setViewMode(mode)
        if (mode === "tipo") {
            setSelectedCategoryId(null)
        }
    }

    console.log("Final pieData:", pieData)
    console.log("ViewMode:", viewMode)

    // Cambiar la condición para no ocultar el componente
    if (viewMode === "tipo" && Object.keys(typeStats).length === 0) {
        return (
            <Card className="mb-6">
                <CardHeader>
                    <CategoryProgressHeader
                        viewMode={viewMode}
                        onModeChange={handleModeChange}
                        onManageCategories={() => setShowModal(true)}
                    />
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No hay datos de productos disponibles
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (viewMode === "categoria" && Object.keys(categoryStats).length === 0) {
        return (
            <Card className="mb-6">
                <CardHeader>
                    <CategoryProgressHeader
                        viewMode={viewMode}
                        onModeChange={handleModeChange}
                        onManageCategories={() => setShowModal(true)}
                    />
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No hay categorías con productos disponibles
                    </div>
                </CardContent>
                <CategoryManagementModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    categories={categories}
                />
            </Card>
        )
    }

    return (
        <Card className="mb-6">
            <CardHeader>
                <CategoryProgressHeader
                    viewMode={viewMode}
                    onModeChange={handleModeChange}
                    onManageCategories={() => setShowModal(true)}
                />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <CategoryPieChart
                        data={pieData}
                        viewMode={viewMode}
                        selectedCategoryId={selectedCategoryId}
                        onPieClick={handlePieClick}
                    />

                    <CategoryProgressBars
                        data={progressData}
                        viewMode={viewMode}
                        selectedCategoryName={selectedCategoryId ? categoryStats[selectedCategoryId]?.name : null}
                    />
                </div>
            </CardContent>

            <CategoryManagementModal isOpen={showModal} onClose={() => setShowModal(false)} categories={categories} />
        </Card>
    )
}
