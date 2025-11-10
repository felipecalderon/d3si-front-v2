"use client"

import { Progress } from "@/components/ui/progress"
import { ICategoryStats, IProgressData } from "@/utils/categoryStats"
import { toPrice } from "@/utils/priceFormat"

type ViewMode = "categoria" | "tipo"

interface CategoryProgressBarsProps {
    data: IProgressData[]
    viewMode: ViewMode
    selectedCategoryName: string | null
    parentCategories?: ICategoryStats[]
    showSummary?: boolean
}

export function CategoryProgressBars({
    data,
    viewMode,
    selectedCategoryName,
    parentCategories = [],
    showSummary = false,
}: CategoryProgressBarsProps) {
    const getTitle = () => {
        if (viewMode === "categoria") {
            if (selectedCategoryName) {
                return `Subcategorías de ${selectedCategoryName}`
            }
            return "Todas las Categorías"
        }
        return `Distribución por Tipo`
    }

    const totalCost = data?.reduce((sum, item) => sum + item.totalRevenue, 0) || 0
    const totalParentCost = parentCategories?.reduce((sum, item) => sum + item.totalCost, 0) || 0

    if (!data) {
        return (
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{getTitle()}</h3>
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">No hay datos disponibles</div>
            </div>
        )
    }
    if (!data.length) {
        // Solo mostrar mensaje de "sin subcategorías" si hay una categoría seleccionada
        if (selectedCategoryName) {
            return (
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{getTitle()}</h3>
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        {selectedCategoryName}: No tiene subcategorías
                    </div>
                </div>
            )
        }
        // Si no hay selección y no hay datos, mostrar mensaje genérico
        return (
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{getTitle()}</h3>
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">No hay datos disponibles</div>
            </div>
        )
    }
    if (showSummary) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Resumen de Categorías Principales
                    </h3>
                    <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                        Costo Neto Total: ${toPrice(totalParentCost)}
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {parentCategories.map((category) => (
                        <div key={category.id} className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm">
                            <div className="font-medium text-gray-800 dark:text-gray-200">{category.name}</div>
                            <div className="mt-2 space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Productos:</span>
                                    <span className="font-medium">{category.productCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Stock Total:</span>
                                    <span className="font-medium">{category.count}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Costo Neto:</span>
                                    <span className="font-medium text-green-600 dark:text-green-400">
                                        ${toPrice(category.totalCost)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{getTitle()}</h3>
                <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                    Costo Neto Total: ${toPrice(totalCost)}
                </div>
            </div>
            <div className="space-y-4">
                {data.map((item) => (
                    <div key={item.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full" bg-[${item.color}]`} />
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {item.name}
                                    </span>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <span>Cantidad: {item.totalStock} unidades</span>
                                        <span>|</span>
                                        <span>
                                            Valor:{" "}
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                                ${toPrice(item.totalRevenue)}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                {item.percentage.toFixed(1)}%
                            </span>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                    </div>
                ))}
            </div>
        </div>
    )
}
