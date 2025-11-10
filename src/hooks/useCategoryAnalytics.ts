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

    // 4. El generador de barras de progreso muestra todas las categorías si no hay selección
    const progressData = useMemo(() => {
        if (viewMode === "categoria" && !selectedCategoryId) {
            // Mostrar todas las categorías principales
            return generateProgressData(parentStats)
        }
        // Mostrar subcategorías de la categoría seleccionada
        return generateProgressData(subcategoryStats)
    }, [viewMode, selectedCategoryId, subcategoryStats, parentStats])

    useEffect(() => {
        // Ya no seleccionamos una categoría por defecto
        // El usuario debe hacer click en el gráfico para seleccionar
    }, [viewMode, parentStats])

    const handlePieClick = (data: { id?: string | null }) => {
        if (viewMode === "categoria") {
            // Si data.id es null, deseleccionar
            setSelectedCategoryId(data.id === null ? null : data.id || null)
        }
    }

    const handleModeChange = (mode: ViewMode) => {
        setViewMode(mode)
        // Siempre deseleccionar al cambiar de modo
        setSelectedCategoryId(null)
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
