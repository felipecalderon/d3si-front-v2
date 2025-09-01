"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

type ViewMode = "categoria" | "tipo"
interface DataToPie {
    color: string
    count: number
    id: string
    name: string
    productCount: number
    profitMargin: number
    totalProfit: number
    totalValue: number
}

interface CategoryPieChartProps {
    data: DataToPie[]
    viewMode: ViewMode
    selectedCategoryId: string | null
    onPieClick: (data: any) => void
}

export function CategoryPieChart({ data, viewMode, selectedCategoryId, onPieClick }: CategoryPieChartProps) {
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className="bg-gray-900 text-white p-3 rounded-md shadow-lg max-w-xs">
                    <div className="font-semibold text-sm border-b pb-1 mb-2">{data.name}</div>
                    <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                            <span>Productos:</span>
                            <span className="font-medium">{data.productCount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Valor Total:</span>
                            <span className="font-medium">${data.totalValue.toLocaleString("es-CL")}</span>
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
    const totalProducts = data.reduce((acc, prev) => prev.productCount + acc, 0)
    const minPercentToDisplay = 0.01 // 0.01 = mostrará solo los porcentajes mayores a 1%
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                {viewMode === "categoria" ? "Categorías Principales" : "Distribución por Tipo"}
            </h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="totalValue"
                            label={({ name, totalValue }) => {
                                const total = data.reduce((sum, item) => sum + item.totalValue, 0)
                                const percentage = total > 0 ? (totalValue / total) * 100 : 0
                                return `${name} ${percentage > 0 ? `(${percentage.toFixed(0)}%)` : ""}`
                            }}
                            labelLine={false}
                            onClick={onPieClick}
                            style={{ cursor: viewMode === "categoria" ? "pointer" : "default", fontSize: "75%" }}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    stroke={
                                        viewMode === "categoria" && selectedCategoryId === entry.id ? "#000" : "none"
                                    }
                                    strokeWidth={viewMode === "categoria" && selectedCategoryId === entry.id ? 2 : 0}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
