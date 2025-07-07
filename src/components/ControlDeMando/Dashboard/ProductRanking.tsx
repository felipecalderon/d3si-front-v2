"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { productosData } from "../Data/constants"

export default function ProductRanking() {
    return (
        <div className="lg:col-span-5 lg:row-span-4 lg:col-start-8">
            <Card className="dark:bg-gray-800 border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="dark:text-white text-sm md:text-base">
                        Ranking Ventas Canal Presencial 80%
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 md:space-y-6">
                        {productosData.map((producto, index) => (
                            <div key={index} className="flex items-center gap-2 md:gap-3">
                                <span className="text-xs md:text-sm dark:text-gray-300 w-16 md:w-auto">
                                    {producto.nombre}
                                </span>
                                <div className="flex-1">
                                    <Progress
                                        value={producto.porcentaje}
                                        className="h-4 md:h-6"
                                        style={{
                                            background: `linear-gradient(to right, ${producto.color} 0%, ${producto.color} ${producto.porcentaje}%, #e5e7eb ${producto.porcentaje}%, #e5e7eb 100%)`,
                                        }}
                                    />
                                </div>
                                <span className="text-xs md:text-sm font-medium dark:text-white bg-green-600 text-white px-2 py-1 rounded">
                                    {producto.porcentaje}%
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}