import type { IProduct } from "@/interfaces/products/IProduct"
import type { ICategory } from "@/interfaces/categories/ICategory"

export type ViewMode = "categoria" | "tipo"

export interface ICategoryStats {
    id: string
    name: string
    totalCost: number
    totalRevenue: number
    count: number
    productCount: number
    subcategories: ICategory[]
}

export interface ITypeStats {
    totalCost: number
    totalRevenue: number
    count: number
    productCount: number
}

export interface IPieData {
    id: string
    name: string
    profitMargin: number
    totalValue: number
    totalProfit: number
    count: number
    productCount: number
    color: string
}

export interface IProgressData {
    id: string
    name: string
    productCount: number
    variationsCount: number
    totalRevenue: number
    percentage: number
    color: string
}

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

// --- Funciones de Cálculo Optimizadas ---

/**
 * Calcula estadísticas agrupadas por tipo/género.
 */
export const calculateTypeStats = (products: IProduct[]): Map<string, ITypeStats> => {
    const stats = new Map<string, any>()
    for (const product of products) {
        const type = product.genre || "Sin género"
        let entry = stats.get(type)
        if (!entry) {
            entry = { totalCost: 0, totalRevenue: 0, count: 0, productCount: 0 }
            stats.set(type, entry)
        }
        entry.productCount += 1
        for (const variation of product.ProductVariations) {
            entry.totalCost += +variation.priceCost * variation.stockQuantity
            entry.totalRevenue += +variation.priceList * variation.stockQuantity
            entry.count += variation.stockQuantity
        }
    }
    return stats
}

/**
 * Calcula estadísticas para todas las categorías y luego acumula los totales
 * de las subcategorías en sus padres.
 */
export const calculateCategoryStats = (products: IProduct[], categories: ICategory[]) => {
    const statsMap = new Map<string, ICategoryStats>()

    // 1. Inicializar el mapa con todas las categorías y subcategorías
    for (const parent of categories) {
        if (!statsMap.has(parent.categoryID)) {
            statsMap.set(parent.categoryID, {
                id: parent.categoryID,
                name: parent.name,
                totalCost: 0,
                totalRevenue: 0,
                count: 0,
                productCount: 0,
                subcategories: parent.subcategories ?? [],
            })
        }
        for (const sub of parent.subcategories ?? []) {
            if (!statsMap.has(sub.categoryID)) {
                statsMap.set(sub.categoryID, {
                    id: sub.categoryID,
                    name: sub.name,
                    totalCost: 0,
                    totalRevenue: 0,
                    count: 0,
                    productCount: 0,
                    subcategories: [],
                })
            }
        }
    }
    // Añadir categoría para productos sin una asignada
    statsMap.set("sin-categoria", {
        id: "sin-categoria",
        name: "Sin Categoría",
        totalCost: 0,
        totalRevenue: 0,
        count: 0,
        productCount: 0,
        subcategories: [],
    })

    // 2. Iterar productos UNA VEZ para poblar las estadísticas iniciales
    for (const product of products) {
        const categoryId = product.categoryID || "sin-categoria"
        const stats = statsMap.get(categoryId)
        if (stats) {
            stats.productCount += 1
            // Contar variaciones y sumar costos
            stats.count += product.ProductVariations.length
            for (const v of product.ProductVariations) {
                stats.totalCost += Number(v.priceCost)
                stats.totalRevenue += Number(v.priceList)
            }
        }
    }

    // 3. Iterar padres y ACUMULAR totales de hijos
    for (const parent of categories) {
        const parentStats = statsMap.get(parent.categoryID)!
        for (const sub of parent.subcategories ?? []) {
            const subStats = statsMap.get(sub.categoryID)!
            parentStats.totalCost += subStats.totalCost
            parentStats.totalRevenue += subStats.totalRevenue
            parentStats.count += subStats.count
            parentStats.productCount += subStats.productCount
        }
    }

    // 4. Devolver todas las estadísticas en un mapa para uso futuro y una lista filtrada de solo padres
    const parentCategoriesStats = categories.map((cat) => statsMap.get(cat.categoryID)!)
    if (statsMap.get("sin-categoria")!.productCount > 0) {
        parentCategoriesStats.push(statsMap.get("sin-categoria")!)
    }

    return {
        allStats: statsMap,
        parentStats: parentCategoriesStats.sort((a, b) => b.totalRevenue - a.totalRevenue),
    }
}

/**
 * Obtiene las estadísticas de las subcategorías desde el mapa pre-calculado.
 * Es una función muy rápida (búsquedas en mapa).
 */
export const calculateSubcategoryStats = (
    selectedCategoryId: string | null,
    allStats: Map<string, ICategoryStats>
): ICategoryStats[] => {
    if (!selectedCategoryId) return []
    const parent = allStats.get(selectedCategoryId)
    if (!parent || !parent.subcategories) return []

    // Simplemente busca las stats de cada subcategoría en el mapa ya calculado.
    return parent.subcategories.map((sub) => allStats.get(sub.categoryID)!)
}

// --- Funciones de Formateo ---

export const generatePieData = (
    viewMode: ViewMode,
    typeStats: Map<string, ITypeStats>,
    categoryStats: ICategoryStats[]
): any[] => {
    if (viewMode === "tipo") {
        return Array.from(typeStats.entries())
            .map(([type, stats], index) => {
                const profitMargin =
                    stats.totalRevenue > 0 ? ((stats.totalRevenue - stats.totalCost) / stats.totalRevenue) * 100 : 0
                return {
                    id: type,
                    name: type,
                    ...stats,
                    profitMargin: Math.max(0, Math.min(100, profitMargin)),
                    color: COLORS[index % COLORS.length],
                    totalValue: stats.productCount, // Necesario para mostrar el gráfico
                }
            })
            .sort((a, b) => b.productCount - a.productCount)
    }

    return categoryStats
        .map((statsItem, index) => {
            const profitMargin =
                statsItem.totalRevenue > 0
                    ? ((statsItem.totalRevenue - statsItem.totalCost) / statsItem.totalRevenue) * 100
                    : 0
            return {
                ...statsItem,
                profitMargin: Math.max(0, Math.min(100, profitMargin)),
                color: COLORS[index % COLORS.length],
                totalValue: statsItem.productCount, // Necesario para mostrar el gráfico
            }
        })
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
}

export const generateProgressData = (subcategoryStats: ICategoryStats[]): IProgressData[] => {
    const totalProducts = subcategoryStats.reduce((sum, item) => sum + item.productCount, 0)
    return subcategoryStats
        .map((sub, index) => ({
            id: sub.id,
            name: sub.name,
            productCount: sub.productCount,
            variationsCount: sub.count || 0,
            totalRevenue: sub.totalCost || 0,
            percentage: totalProducts > 0 ? (sub.productCount / totalProducts) * 100 : 0,
            color: COLORS[index % COLORS.length],
        }))
        .sort((a, b) => b.productCount - a.productCount)
}
