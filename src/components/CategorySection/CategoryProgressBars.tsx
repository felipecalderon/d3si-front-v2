"use client"

import { Progress } from "@/components/ui/progress"
import { IProgressData } from "@/utils/categoryStats"

type ViewMode = "categoria" | "tipo"

interface CategoryProgressBarsProps {
    data: IProgressData[]
    viewMode: ViewMode
    selectedCategoryName: string | null
}

export function CategoryProgressBars({ data, viewMode, selectedCategoryName }: CategoryProgressBarsProps) {
    const getTitle = () => {
        if (viewMode === "categoria" && selectedCategoryName) {
            return `Subcategorías de ${selectedCategoryName}`
        }
        return `Distribución por ${viewMode === "categoria" ? "Categoría" : "Tipo"}`
    }

    if (!data) {
        return (
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{getTitle()}</h3>
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">No hay datos disponibles</div>
            </div>
        )
    }
    if (!data.length) {
        return (
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{getTitle()}</h3>
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    {selectedCategoryName}: No tiene subcategorías
                </div>
            </div>
        )
    }
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{getTitle()}</h3>
            <div className="space-y-4">
                {data.map((item) => (
                    <div key={item.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full" bg-[${item.color}]`} />
                                <div className="flex justify-between items-end gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {item.name}
                                    </span>
                                    <span>{item.productCount} productos</span>
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
