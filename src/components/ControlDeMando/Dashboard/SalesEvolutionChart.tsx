"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XAxis, CartesianGrid, AreaChart, Area } from "recharts"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { ventasData, chartConfig } from "../Data/constants"

export default function SalesEvolutionChart() {
    return (
        <div className="lg:col-span-9 lg:row-span-3 relative lg:col-start-4 lg:row-start-5">
            {/* Headers del gráfico - Solo en desktop */}
            <div className="hidden lg:flex lg:absolute lg:-top-20 left-0 text-sm gap-3">
                <div className="flex text-center rounded-md dark:bg-gray-800 border-0 shadow-lg py-2 px-6">
                    <div className="flex flex-col">
                        <span className="text-green-600">Ranking Ventas</span>
                        <span className="text-green-600">Canal Mayorista</span>
                    </div>
                    <span className="font-medium mt-3 ml-2 dark:text-white">15%</span>
                </div>
                <div className="flex text-center rounded-md dark:bg-gray-800 border-0 shadow-lg py-2 px-6">
                    <div className="flex flex-col">
                        <span className="text-blue-600">Ranking Ventas</span>
                        <span className="text-blue-600">Canal Web</span>
                    </div>
                    <span className="font-medium mt-3 ml-2 dark:text-white">5%</span>
                </div>
            </div>
            <Card className="dark:bg-gray-800 border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xs md:text-sm dark:text-white">
                        Evolución de Ventas Totales últimos 12 meses / Meta
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer className="h-[200px] md:h-[250px] w-full" config={chartConfig}>
                        <AreaChart data={ventasData}>
                            <defs>
                                <linearGradient id="fillPresencial" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="fillMayorista" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="fillWeb" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis dataKey="mes" tickLine={false} axisLine={false} />

                            <ChartTooltip
                                content={
                                    <ChartTooltipContent indicator="dot" labelFormatter={(value) => `Mes: ${value}`} />
                                }
                            />

                            <Area
                                type="monotone"
                                dataKey="presencial"
                                fill="url(#fillPresencial)"
                                stroke="#22c55e"
                                stackId="ventas"
                            />
                            <Area
                                type="monotone"
                                dataKey="mayorista"
                                fill="url(#fillMayorista)"
                                stroke="#f97316"
                                stackId="ventas"
                            />
                            <Area
                                type="monotone"
                                dataKey="web"
                                fill="url(#fillWeb)"
                                stroke="#3b82f6"
                                stackId="ventas"
                            />

                            <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}