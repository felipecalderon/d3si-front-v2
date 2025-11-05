import { useState, useMemo, useEffect } from "react"
import type { IProduct } from "@/interfaces/products/IProduct"
import type { ICategory } from "@/interfaces/categories/ICategory"
import {
    calculateTypeStats,
    calculateCategoryStats,
    calculateSubcategoryStats,
    generatePieData,
    generateProgressData,
    ViewMode,
    IPieData,
} from "@/utils/categoryStats"

interface UseCategoryAnalyticsProps {
    products: IProduct[]
    categories: ICategory[]
}

export const useCategoryAnalytics = ({ products, categories }: UseCategoryAnalyticsProps) => {
    const [viewMode, setViewMode] = useState<ViewMode>("categoria")
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
    const [showModal, setShowModal] = useState(false)

    const typeStats = useMemo(() => calculateTypeStats(products), [products])

    // 1. El cálculo principal ahora devuelve dos piezas de datos
    const { parentStats, allStats } = useMemo(
        () => calculateCategoryStats(products, categories),
        [products, categories]
    )

    // 2. El cálculo de subcategorías ahora es mucho más rápido
    const subcategoryStats = useMemo(
        () => calculateSubcategoryStats(selectedCategoryId, allStats),
        [selectedCategoryId, allStats]
    )

    // 3. Pasamos los stats de los padres al generador del gráfico
    const pieData = useMemo(() => generatePieData(viewMode, typeStats, parentStats), [viewMode, typeStats, parentStats])

    // 4. El generador de barras de progreso ya no depende del modo de vista
    const progressData = useMemo(() => generateProgressData(subcategoryStats), [subcategoryStats])

    useEffect(() => {
        if (viewMode === "categoria" && !selectedCategoryId && parentStats.length > 0) {
            const calzadoCategory = parentStats.find((cat) => cat.name.toLowerCase().includes("calzado"))
            setSelectedCategoryId(calzadoCategory ? calzadoCategory.id : parentStats[0].id)
        }
    }, [viewMode, parentStats, selectedCategoryId])

    const handlePieClick = (data: { id?: string }) => {
        if (viewMode === "categoria" && data.id) {
            setSelectedCategoryId(data.id)
        }
    }

    const handleModeChange = (mode: ViewMode) => {
        setViewMode(mode)
        if (mode === "tipo") {
            setSelectedCategoryId(null)
        } else if (pieData.length > 0) {
            const topCategory = pieData[0] as IPieData
            setSelectedCategoryId(topCategory.id || null)
        } else {
            setSelectedCategoryId(null)
        }
    }

    const selectedCategoryName = useMemo(() => {
        if (viewMode === "categoria" && selectedCategoryId) {
            return allStats.get(selectedCategoryId)?.name || null
        }
        return null
    }, [viewMode, selectedCategoryId, allStats])

    const hasData = viewMode === "tipo" ? typeStats.size > 0 : parentStats.length > 0

    return {
        viewMode,
        selectedCategoryId,
        showModal,
        pieData,
        progressData,
        selectedCategoryName,
        hasData,
        parentStats,
        handleModeChange,
        handlePieClick,
        setShowModal,
    }
}
