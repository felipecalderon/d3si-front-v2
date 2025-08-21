"use client"

import React from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
const DynamicGaugeChart = dynamic(() => import("@/components/Caja/VentasTotalesGrafico/GaugeChart"), { ssr: false })

export default function GaugeChartSection() {
    return (
        <div className="lg:col-span-4 lg:mb-0 mb-10 lg:row-span-4 lg:col-start-4">
            <Card className="dark:bg-gray-800 border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center relative dark:text-white text-sm md:text-base">
                        Ventas totales del presente mes / Meta
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="flex justify-center items-center h-48 md:h-full">
                        <div className="w-full max-w-sm mx-auto">
                            <DynamicGaugeChart />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
