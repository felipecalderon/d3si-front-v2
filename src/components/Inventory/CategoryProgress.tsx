"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { IProduct } from "@/interfaces/products/IProduct"

interface CategoryProgressProps {
    products: IProduct[]
}

export function CategoryProgress({ products }: CategoryProgressProps) {
    // Calcular estadísticas por categoría
    const categoryStats = products.reduce((acc, product) => {
        const category = product.genre || "Sin género"

        if (!acc[category]) {
            acc[category] = {
                totalCost: 0,
                totalRevenue: 0,
                count: 0,
                productCount: 0,
            }
        }

        // Contar productos (no variaciones)
        acc[category].productCount += 1

        product.ProductVariations.forEach((variation) => {
            const cost = variation.priceCost * variation.stockQuantity
            const revenue = variation.priceList * variation.stockQuantity

            acc[category].totalCost += cost
            acc[category].totalRevenue += revenue
            acc[category].count += variation.stockQuantity
        })

        return acc
    }, {} as Record<string, { totalCost: number; totalRevenue: number; count: number; productCount: number }>)

    // Calcular porcentajes de ganancia
    const categoryData = Object.entries(categoryStats)
        .map(([category, stats]) => {
            const profitMargin =
                stats.totalRevenue > 0 ? ((stats.totalRevenue - stats.totalCost) / stats.totalRevenue) * 100 : 0

            return {
                category,
                profitMargin: Math.max(0, Math.min(100, profitMargin)),
                totalValue: stats.totalRevenue,
                totalProfit: stats.totalRevenue - stats.totalCost,
                count: stats.count,
                productCount: stats.productCount,
            }
        })
        .sort((a, b) => b.totalProfit - a.totalProfit)

    // Calcular el total de productos
    const totalProducts = categoryData.reduce((sum, item) => sum + item.productCount, 0)

    // Colores para el gráfico de torta
    const COLORS = [
        "#3B82F6", // blue-500
        "#10B981", // green-500
        "#8B5CF6", // purple-500
        "#F59E0B", // orange-500
        "#EC4899", // pink-500
        "#6366F1", // indigo-500
        "#EF4444", // red-500
        "#EAB308", // yellow-500
        "#14B8A6", // teal-500
        "#06B6D4", // cyan-500
    ]

    // Preparar datos para el gráfico de torta
    const pieData = categoryData.map((item, index) => ({
        name: item.category,
        value: item.totalValue,
        profitMargin: item.profitMargin,
        totalProfit: item.totalProfit,
        count: item.count,
        productCount: item.productCount,
        color: COLORS[index % COLORS.length],
    }))

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            const totalRevenue = pieData.reduce((sum, item) => sum + item.value, 0)
            const percentage = totalRevenue > 0 ? (data.value / totalRevenue) * 100 : 0

            return (
                <div className="bg-gray-900 text-white p-3 rounded-md shadow-lg max-w-xs">
                    <div className="font-semibold text-sm border-b pb-1 mb-2">{data.name}</div>
                    <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                            <span>Productos:</span>
                            <span className="font-medium">{data.count}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Valor Total:</span>
                            <span className="font-medium">${data.value.toLocaleString("es-CL")}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>% del Total:</span>
                            <span className="font-medium text-blue-400">{percentage.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Margen:</span>
                            <span className="font-medium text-green-400">{data.profitMargin.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            )
        }
        return null
    }

    if (categoryData.length === 0) return null

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Distribución de inventario por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Gráfico de torta */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">Actividad</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ value, name }) => {
                                            const total = pieData.reduce((sum, item) => sum + item.value, 0)
                                            const percentage = total > 0 ? (value / total) * 100 : 0
                                            return percentage > 5 ? `${percentage.toFixed(0)}%` : ""
                                        }}
                                        labelLine={false}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Barras individuales */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Distribución de Género por Productos
                        </h3>
                        <div className="space-y-4">
                            {categoryData.map((item, index) => {
                                const productPercentage =
                                    totalProducts > 0 ? (item.productCount / totalProducts) * 100 : 0

                                return (
                                    <div key={item.category} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                />
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {item.category}
                                                </span>
                                            </div>
                                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                                {productPercentage.toFixed(1)}%
                                            </span>
                                        </div>
                                        <Progress value={productPercentage} className="h-2" />
                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                            <span>{item.productCount} productos</span>
                                            <span>{item.count} unidades stock</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}