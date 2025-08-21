"use client"

import { useState, useMemo, useEffect } from "react"
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
    const [viewMode, setViewMode] = useState<ViewMode>("categoria")
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
    const [showModal, setShowModal] = useState(false)

    // Crear un mapa de todas las categorías (incluyendo subcategorías) para búsqueda rápida
    const allCategoriesMap = useMemo(() => {
        const map = new Map<string, ICategory>()
        categories.forEach((cat) => {
            map.set(cat.categoryID, cat)
        })
        return map
    }, [categories])

    // Datos para vista por tipo (género)
    const typeStats = useMemo(() => {
        const stats = products.reduce((acc, product) => {
            const type = product.genre || "Sin género"

            if (!acc[type]) {
                acc[type] = {
                    totalCost: 0,
                    totalRevenue: 0,
                    count: 0,
                    productCount: 0,
                }
            }

            acc[type].productCount += 1 // (ESTO está bien para contar productos únicos por tipo)

            product.ProductVariations.forEach((variation, varIndex) => {
                const cost = Number(variation.priceCost) * variation.stockQuantity
                const revenue = Number(variation.priceList) * variation.stockQuantity
                acc[type].totalCost += cost
                acc[type].totalRevenue += revenue
                acc[type].count += variation.stockQuantity
            })
            return acc
        }, {} as Record<string, { totalCost: number; totalRevenue: number; count: number; productCount: number }>)
        return stats
    }, [products])

    // Datos para vista por categoría (agrupados por categoría padre)
    const categoryStats = useMemo(() => {
        const stats: Record<
            string,
            {
                id: string
                name: string
                totalCost: number
                totalRevenue: number
                count: number
                productCount: number
                subcategories: ICategory[] // Direct subcategories of this parent
            }
        > = {}

        // 1. Initialize stats for ALL parent categories, regardless of products
        categories
            .filter((cat) => cat.parentID === null || cat.parentID === "")
            .forEach((parentCat) => {
                stats[parentCat.categoryID] = {
                    id: parentCat.categoryID,
                    name: parentCat.name,
                    totalCost: 0,
                    totalRevenue: 0,
                    count: 0,
                    productCount: 0,
                    subcategories: categories.filter((sub) => sub.parentID === parentCat.categoryID),
                }
            })

        // 2. Add "Sin Categoría" placeholder (always present)
        stats["sin-categoria"] = {
            id: "sin-categoria",
            name: "Sin Categoría",
            totalCost: 0,
            totalRevenue: 0,
            count: 0,
            productCount: 0,
            subcategories: [],
        }

        // 3. Aggregate product data into their respective parent categories
        products.forEach((product) => {
            let parentId = "sin-categoria"
            const category = product.Category
            const fallbackCategory = product.categoryID ? allCategoriesMap.get(product.categoryID) : null

            if (category?.categoryID) {
                parentId = category.parentID || category.categoryID
            } else if (fallbackCategory) {
                parentId = fallbackCategory.parentID || fallbackCategory.categoryID
            }

            // Validate that parentId exists in stats, fallback to "sin-categoria" if not
            if (!stats[parentId]) {
                console.warn(
                    `WARNING: Unrecognized category ID '${parentId}' for product '${product.name}'. Falling back to "Sin Categoría".`
                )
                parentId = "sin-categoria"
            }

            const target = stats[parentId]

            target.productCount += 1

            product.ProductVariations.forEach((v) => {
                const cost = Number(v.priceCost) * v.stockQuantity
                const revenue = Number(v.priceList) * v.stockQuantity

                target.totalCost += cost
                target.totalRevenue += revenue
                target.count += v.stockQuantity
            })
        })

        // 4. Convert to array. Do not filter out categories with 0 products here, as the user wants them to show up.
        const finalStatsArray = Object.values(stats)

        // Sort by totalRevenue for consistent pie chart display (categories with products first, then empty ones)
        finalStatsArray.sort((a, b) => b.totalRevenue - a.totalRevenue)
        return finalStatsArray
    }, [products, categories, allCategoriesMap])

    // Datos para subcategorías de la categoría seleccionada
    const subcategoryStats = useMemo(() => {
        if (!selectedCategoryId || selectedCategoryId === "sin-categoria") {
            return []
        }

        const selectedParentCategory = allCategoriesMap.get(selectedCategoryId)
        if (selectedParentCategory) {
            const directSubcategories = categories.filter((cat) => cat.parentID === selectedParentCategory.categoryID)

            // Get direct subcategories of the selected parent

            let itemsToShow: {
                name: string
                productCount: number
                count: number
                totalValue: number
                profitMargin: number
            }[] = []

            if (directSubcategories.length > 0) {
                // Show direct subcategories
                const stats: Record<
                    string,
                    {
                        name: string
                        totalCost: number
                        totalRevenue: number
                        count: number
                        productCount: number
                        totalValue: number
                        profitMargin: number
                    }
                > = {}

                // Initialize stats for all direct subcategories, even if they have no products
                directSubcategories.forEach((subcat) => {
                    stats[subcat.categoryID] = {
                        name: subcat.name,
                        totalCost: 0,
                        totalRevenue: 0,
                        count: 0,
                        productCount: 0,
                        totalValue: 0,
                        profitMargin: 0,
                    }
                })

                products.forEach((product) => {
                    let productSubcategoryId = null
                    let productDebugInfo = `  Processing product: ${product.name} (ID: ${product.productID})`

                    // Determine the subcategory ID of the product, prioritizing product.Category object
                    if (product.Category && typeof product.Category === "object" && product.Category.categoryID) {
                        productSubcategoryId = product.Category.categoryID
                        productDebugInfo += `, Subcategory ID from product.Category: ${productSubcategoryId}`
                    } else if (product.categoryID) {
                        productSubcategoryId = product.categoryID
                        productDebugInfo += `, Subcategory ID from product.categoryID: ${productSubcategoryId}`
                    } else {
                        productDebugInfo += `, No subcategory ID found for product.`
                    }

                    // Check if this product's subcategory ID is one of the direct subcategories of the selected parent
                    if (productSubcategoryId && stats[productSubcategoryId]) {
                        const targetStat = stats[productSubcategoryId]
                        productDebugInfo += `. Matches direct subcategory: ${targetStat.name}. Aggregating.`

                        targetStat.productCount += 1
                        product.ProductVariations.forEach((variation) => {
                            const cost = Number(variation.priceCost) * variation.stockQuantity
                            const revenue = Number(variation.priceList) * variation.stockQuantity

                            targetStat.totalCost += cost
                            targetStat.totalRevenue += revenue
                            targetStat.count += variation.stockQuantity
                        })
                    }
                })

                itemsToShow = Object.values(stats)
                    .map((item) => {
                        const profitMargin =
                            item.totalRevenue > 0 ? ((item.totalRevenue - item.totalCost) / item.totalRevenue) * 100 : 0
                        return {
                            ...item,
                            totalValue: item.totalRevenue,
                            profitMargin: Math.max(0, Math.min(100, profitMargin)),
                        }
                    })
                    .sort((a, b) => b.totalValue - a.totalValue)
            } else {
                // If no direct subcategories, show the selected parent category itself
                const selectedCategoryData = categoryStats.find((cat) => cat.id === selectedCategoryId)
                if (selectedCategoryData) {
                    itemsToShow = [
                        {
                            name: selectedCategoryData.name,
                            productCount: selectedCategoryData.productCount,
                            count: selectedCategoryData.count,
                            totalValue: selectedCategoryData.totalRevenue,
                            profitMargin:
                                selectedCategoryData.totalRevenue > 0
                                    ? ((selectedCategoryData.totalRevenue - selectedCategoryData.totalCost) /
                                          selectedCategoryData.totalRevenue) *
                                      100
                                    : 0,
                        },
                    ]
                }
            }

            return itemsToShow
        }
    }, [selectedCategoryId, products, categories, allCategoriesMap, categoryStats])

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
            const data = Object.entries(typeStats)
                .map(([type, stats]) => {
                    const profitMargin =
                        stats.totalRevenue > 0 ? ((stats.totalRevenue - stats.totalCost) / stats.totalRevenue) * 100 : 0

                    return {
                        name: type,
                        profitMargin: Math.max(0, Math.min(100, profitMargin)),
                        totalValue: stats.productCount, // ✅ usar la cantidad de productos como valor del pie
                        totalProfit: stats.totalRevenue - stats.totalCost,
                        count: stats.count,
                        productCount: stats.productCount,
                        id: type,
                    }
                })
                .sort((a, b) => b.productCount - a.productCount) // ✅ ordenar por cantidad de productos
                .map((item, index) => ({
                    ...item,
                    color: COLORS[index % COLORS.length],
                }))
            return data
        } else {
            const categoryData = categoryStats
                .map((statsItem, index) => {
                    const profitMargin =
                        statsItem.totalRevenue > 0
                            ? ((statsItem.totalRevenue - statsItem.totalCost) / statsItem.totalRevenue) * 100
                            : 0

                    return {
                        id: statsItem.id,
                        name: statsItem.name,
                        profitMargin: Math.max(0, Math.min(100, profitMargin)),
                        totalValue: statsItem.productCount,
                        totalProfit: statsItem.totalRevenue - statsItem.totalCost,
                        count: statsItem.count,
                        productCount: statsItem.productCount,
                        color: COLORS[index % COLORS.length],
                    }
                })
                .sort((a, b) => b.totalProfit - a.totalProfit)
            return categoryData
        }
    }, [viewMode, typeStats, categoryStats])

    // Datos para el progress lateral
    const progressData = useMemo(() => {
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
            const totalProducts = pieData.reduce((sum, item) => sum + item.productCount, 0)
            return pieData.map((item) => ({
                ...item,
                percentage: totalProducts > 0 ? (item.productCount / totalProducts) * 100 : 0,
            }))
        } else {
            if (selectedCategoryId) {
                // Buscar la categoría seleccionada
                const selectedCategory = categories.find((cat) => cat.categoryID === selectedCategoryId)

                // Obtener las subcategorías de esa categoría (o un array vacío si no tiene)
                const subcategories = selectedCategory?.subcategories || []

                // Calcular el número total de productos que tienen subcategorías hijas de esa categoría
                const subcategoryCounts = subcategories.map((subcat) => {
                    const count = products.filter((p) => p.categoryID === subcat.categoryID).length
                    return {
                        id: subcat.categoryID,
                        name: subcat.name,
                        productCount: count,
                    }
                })

                const totalProductsInSelectedParent = subcategoryCounts.reduce((sum, sub) => sum + sub.productCount, 0)

                // 1. Ordenar subcategorías por cantidad de productos (descendente)
                const sortedSubcategories = [...subcategoryCounts].sort((a, b) => b.productCount - a.productCount)

                // 2. Mapear con color y porcentaje
                const dataForBars = sortedSubcategories.map((sub, index) => ({
                    id: sub.id,
                    name: sub.name,
                    productCount: sub.productCount,
                    percentage:
                        totalProductsInSelectedParent > 0
                            ? (sub.productCount / totalProductsInSelectedParent) * 100
                            : 0,
                    color: COLORS[index % COLORS.length],
                }))
                return dataForBars
            }
        }
    }, [viewMode, pieData, selectedCategoryId, subcategoryStats, categoryStats]) // Added categoryStats to dependencies

    // Auto-seleccionar la categoría con mayor porcentaje cuando cambie a modo categoría
    useEffect(() => {
        if (viewMode === "categoria" && !selectedCategoryId && categoryStats.length > 0) {
            const calzadoCategory = categoryStats.find((cat) => cat.name.toLowerCase().includes("calzado"))

            if (calzadoCategory) {
                setSelectedCategoryId(calzadoCategory.id)
            } else {
                setSelectedCategoryId(categoryStats[0].id)
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
        } else {
            // When switching to 'categoria' mode, try to auto-select the top category
            if (pieData.length > 0) {
                const topCategory = pieData[0] as any
                if (topCategory.id) {
                    setSelectedCategoryId(topCategory.id)
                } else {
                    setSelectedCategoryId(null)
                }
            } else {
                setSelectedCategoryId(null)
            }
        }
    }

    // Obtener el nombre de la categoría seleccionada para el título de las barras
    const selectedCategoryName = useMemo(() => {
        if (viewMode === "categoria" && selectedCategoryId) {
            const foundCategory = categoryStats.find((item) => item.id === selectedCategoryId)
            return foundCategory ? foundCategory.name : null
        }
        return null
    }, [viewMode, selectedCategoryId, categoryStats])

    // Cambiar la condición para no ocultar el componente
    const hasTypeData = Object.keys(typeStats).length > 0
    const hasCategoryData = categoryStats.length > 0

    if (viewMode === "tipo" && !hasTypeData) {
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
                        No hay datos de productos disponibles por tipo.
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (viewMode === "categoria" && !hasCategoryData) {
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
                        No hay categorías con productos disponibles.
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
                    {/* Scrollable wrapper para las barras */}
                    <div className="max-h-[400px] overflow-y-auto pr-1">
                        <CategoryProgressBars
                            data={progressData ?? []}
                            viewMode={viewMode}
                            selectedCategoryName={selectedCategoryName}
                        />
                    </div>
                </div>
            </CardContent>

            <CategoryManagementModal isOpen={showModal} onClose={() => setShowModal(false)} categories={categories} />
        </Card>
    )
}
