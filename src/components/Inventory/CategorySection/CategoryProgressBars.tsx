"use client"

import { Progress } from "@/components/ui/progress"

type ViewMode = "categoria" | "tipo"

interface CategoryProgressBarsProps {
  data: any[]
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

  if (!data || data.length === 0) {
      return (
          <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{getTitle()}</h3>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {viewMode === "categoria"
                      ? "Selecciona una categoría en el gráfico para ver sus subcategorías"
                      : "No hay datos disponibles"}
              </div>
          </div>
      )
  }

  return (
      <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{getTitle()}</h3>
          <div className="space-y-4">
              {data.map((item, index) => (
                  <div key={item.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full" bg-[${item.color}]`} />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                          </div>
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                              {item.percentage.toFixed(1)}%
                          </span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>{item.productCount} productos</span>
                          <span>{item.count} unidades stock</span>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  )
}
