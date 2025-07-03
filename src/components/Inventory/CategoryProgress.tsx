"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { IProduct } from "@/interfaces/products/IProduct"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@radix-ui/react-tooltip"

interface CategoryProgressProps {
  products: IProduct[]
}

export function CategoryProgress({ products }: CategoryProgressProps) {
  // Calcular estadísticas por categoría
  const categoryStats = products.reduce(
    (acc, product) => {
      const category = product.genre || "Sin categoría"

      if (!acc[category]) {
        acc[category] = {
          totalCost: 0,
          totalRevenue: 0,
          count: 0,
        }
      }

      product.ProductVariations.forEach((variation) => {
        const cost = variation.priceCost * variation.stockQuantity
        const revenue = variation.priceList * variation.stockQuantity

        acc[category].totalCost += cost
        acc[category].totalRevenue += revenue
        acc[category].count += variation.stockQuantity
      })

      return acc
    },
    {} as Record<string, { totalCost: number; totalRevenue: number; count: number }>,
  )

  // Calcular porcentajes de ganancia
  const categoryData = Object.entries(categoryStats)
    .map(([category, stats]) => {
      const profitMargin =
        stats.totalRevenue > 0 ? ((stats.totalRevenue - stats.totalCost) / stats.totalRevenue) * 100 : 0

      return {
        category,
        profitMargin: Math.max(0, Math.min(100, profitMargin)),
        totalValue: stats.totalRevenue,
        count: stats.count,
      }
    })
    .sort((a, b) => b.profitMargin - a.profitMargin)

  if (categoryData.length === 0) return null

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Distribución de Ganancias por Categoría</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Barra principal segmentada */}
        <div className="mb-8">
          <div className="relative">
            {/* Barra de progreso segmentada */}
            <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex shadow-inner">
              <TooltipProvider>
                {categoryData.map((item, index) => {
                  const totalRevenue = categoryData.reduce((sum, cat) => sum + cat.totalValue, 0)
                  const percentage = totalRevenue > 0 ? (item.totalValue / totalRevenue) * 100 : 0

                  // Colores para cada categoría
                  const colors = [
                    "bg-blue-500 hover:bg-blue-600",
                    "bg-green-500 hover:bg-green-600",
                    "bg-purple-500 hover:bg-purple-600",
                    "bg-orange-500 hover:bg-orange-600",
                    "bg-pink-500 hover:bg-pink-600",
                    "bg-indigo-500 hover:bg-indigo-600",
                    "bg-red-500 hover:bg-red-600",
                    "bg-yellow-500 hover:bg-yellow-600",
                    "bg-teal-500 hover:bg-teal-600",
                    "bg-cyan-500 hover:bg-cyan-600",
                  ]

                  const colorClass = colors[index % colors.length]

                  return (
                    <Tooltip key={item.category}>
                      <TooltipTrigger asChild>
                        <div
                          className={`${colorClass} transition-all duration-300 cursor-pointer relative flex items-center justify-center`}
                          style={{ width: `${Math.max(percentage, 2)}%` }}
                        >
                          {/* Nombre de la categoría */}
                          {percentage > 8 && (
                            <div className="text-white text-xs font-semibold text-center px-1">
                              <div className="truncate">{item.category}</div>
                              <div className="text-xs opacity-90">{percentage.toFixed(1)}%</div>
                            </div>
                          )}

                          {/* Para categorías pequeñas, mostrar solo el porcentaje */}
                          {percentage <= 8 && percentage > 3 && (
                            <div className="text-white text-xs font-bold">{percentage.toFixed(0)}%</div>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs rounded-md bg-gray-900 p-3 text-white">
                        <div className="space-y-2">
                          <div className="font-semibold text-sm border-b pb-1">{item.category}</div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span>Productos:</span>
                              <span className="font-medium">{item.count}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Valor Total:</span>
                              <span className="font-medium">${item.totalValue.toLocaleString("es-CL")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>% del Total:</span>
                              <span className="font-medium text-blue-600">{percentage.toFixed(2)}%</span>
                            </div>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </TooltipProvider>
            </div>
          </div>
        </div>
        {/* Barras individuales existentes */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Margen de Ganancia Individual por Categoría
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryData.map((item, index) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.category}</span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    {item.profitMargin.toFixed(1)}%
                  </span>
                </div>
                <Progress value={item.profitMargin} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{item.count} productos</span>
                  <span>${item.totalValue.toLocaleString("es-CL")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
